import torch
import torch.nn as nn
from torch_geometric.data import Data
from torch_geometric.nn import GCNConv
import pandas as pd
import folium
from folium.plugins import MarkerCluster
import numpy as np
import heapq
from itertools import permutations

# 1. Загружаем данные
data = pd.read_csv("data_clean.csv")

# 2. Создание списка узлов и рёбер для графа
node_features = []
edge_index = []
edge_attr = []
node_map = {}
coordinates_to_idx = {}  # Для быстрого поиска индекса по координатам

# Составляем список узлов (координаты точек)
for i, row in data.iterrows():
    from_node = (row['from_lat'], row['from_lon'])
    to_node = (row['to_lat'], row['to_lon'])
    
    if from_node not in node_map:
        node_map[from_node] = len(node_features)
        coordinates_to_idx[from_node] = len(node_features)
        node_features.append([row['from_lat'], row['from_lon']])
    
    if to_node not in node_map:
        node_map[to_node] = len(node_features)
        coordinates_to_idx[to_node] = len(node_features)
        node_features.append([row['to_lat'], row['to_lon']])
    
    from_node_idx = node_map[from_node]
    to_node_idx = node_map[to_node]
    
    # Добавляем рёбра (с индексами узлов)
    edge_index.append([from_node_idx, to_node_idx])
    edge_attr.append([row['predicted_time_min']])  # Время как признак ребра

# Преобразуем данные в тензоры для PyTorch Geometric
edge_index = torch.tensor(edge_index, dtype=torch.long).t().contiguous()
edge_attr = torch.tensor(edge_attr, dtype=torch.float)
node_features = torch.tensor(node_features, dtype=torch.float)

# Создаем объект Data для PyTorch Geometric
graph_data = Data(x=node_features, edge_index=edge_index, edge_attr=edge_attr)

# 3. Определение модели GNN для предсказания стоимости путей
class CostGNN(nn.Module):
    def __init__(self, node_in_channels, edge_in_channels, hidden_channels, out_channels):
        super(CostGNN, self).__init__()
        self.node_conv1 = GCNConv(node_in_channels, hidden_channels)
        self.node_conv2 = GCNConv(hidden_channels, hidden_channels)
        
        # Для предсказания стоимости ребер
        self.edge_predictor = nn.Sequential(
            nn.Linear(hidden_channels * 2 + edge_in_channels, hidden_channels),
            nn.ReLU(),
            nn.Linear(hidden_channels, hidden_channels // 2),
            nn.ReLU(),
            nn.Linear(hidden_channels // 2, out_channels)
        )
    
    def forward(self, data):
        x, edge_index, edge_attr = data.x, data.edge_index, data.edge_attr
        
        # Обработка узловых признаков
        x = self.node_conv1(x, edge_index)
        x = torch.relu(x)
        x = self.node_conv2(x, edge_index)
        
        # Получаем признаки для начальных и конечных узлов каждого ребра
        src, dst = edge_index[0], edge_index[1]
        src_features = x[src]
        dst_features = x[dst]
        
        # Объединяем признаки для предсказания стоимости
        edge_features = torch.cat([src_features, dst_features, edge_attr], dim=1)
        edge_costs = self.edge_predictor(edge_features)
        
        return edge_costs.squeeze()

# 4. Инициализация модели
model = CostGNN(node_in_channels=2, edge_in_channels=1, hidden_channels=64, out_channels=1)

# 5. Функция для создания матрицы стоимости
def create_cost_matrix(model, data, points):
    """Создает матрицу стоимости между всеми точками"""
    model.eval()
    with torch.no_grad():
        predicted_costs = model(data)
    
    # Создаем словарь для быстрого доступа к стоимости между узлами
    cost_dict = {}
    for i in range(data.edge_index.shape[1]):
        src = data.edge_index[0, i].item()
        dst = data.edge_index[1, i].item()
        cost = predicted_costs[i].item()
        cost_dict[(src, dst)] = cost
    
    # Создаем матрицу стоимости для заданных точек
    n = len(points)
    cost_matrix = np.zeros((n, n))
    
    for i in range(n):
        for j in range(n):
            if i == j:
                cost_matrix[i][j] = 0
            else:
                src_idx = coordinates_to_idx[points[i]]
                dst_idx = coordinates_to_idx[points[j]]
                cost_matrix[i][j] = cost_dict.get((src_idx, dst_idx), float('inf'))
    
    return cost_matrix

# 6. Алгоритм для поиска оптимального маршрута (TSP - задача коммивояжера)
def find_optimal_route(cost_matrix, start_index=0):
    """Находит оптимальный маршрут через все точки, возвращаясь в начало"""
    n = len(cost_matrix)
    
    # Если точек немного, используем полный перебор
    if n <= 10:
        return brute_force_tsp(cost_matrix, start_index)
    else:
        return nearest_neighbor_tsp(cost_matrix, start_index)

def brute_force_tsp(cost_matrix, start_index):
    """Решает TSP полным перебором (для небольшого количества точек)"""
    n = len(cost_matrix)
    points = list(range(n))
    points.remove(start_index)
    
    min_cost = float('inf')
    best_route = None
    
    for perm in permutations(points):
        route = [start_index] + list(perm) + [start_index]
        cost = 0
        for i in range(len(route) - 1):
            cost += cost_matrix[route[i]][route[i + 1]]
        
        if cost < min_cost:
            min_cost = cost
            best_route = route
    
    return best_route, min_cost

def nearest_neighbor_tsp(cost_matrix, start_index):
    """Жадный алгоритм ближайшего соседа для TSP"""
    n = len(cost_matrix)
    unvisited = set(range(n))
    unvisited.remove(start_index)
    
    route = [start_index]
    current = start_index
    total_cost = 0
    
    while unvisited:
        next_point = min(unvisited, key=lambda x: cost_matrix[current][x])
        total_cost += cost_matrix[current][next_point]
        route.append(next_point)
        unvisited.remove(next_point)
        current = next_point
    
    # Возвращаемся в начальную точку
    total_cost += cost_matrix[current][start_index]
    route.append(start_index)
    
    return route, total_cost

# 7. Основная функция для тестирования маршрута
def find_optimal_route_with_costs(model, data, start_point, points_to_visit):
    """Находит оптимальный маршрут с учетом предсказанных стоимостей"""
    # Все точки маршрута (старт + точки для посещения)
    all_points = [start_point] + points_to_visit
    
    # Создаем матрицу стоимости
    cost_matrix = create_cost_matrix(model, data, all_points)
    
    # Находим оптимальный маршрут (начинаем с индекса 0 - стартовая точка)
    optimal_route_indices, total_cost = find_optimal_route(cost_matrix, 0)
    
    # Преобразуем индексы обратно в координаты
    optimal_route_coords = []
    for idx in optimal_route_indices:
        optimal_route_coords.append((idx, all_points[idx]))
    
    return optimal_route_coords, total_cost

# 8. Пример данных для теста
start_point = (47.21805, 39.697207)  # Пример стартовой точки
points_to_visit = [
    (47.217621, 39.707611), 
    (47.221096, 39.690970), 
    (47.225482, 39.717826), 
    (47.255549, 39.644401),
    (47.224904, 39.711349)
]

# 9. Получаем оптимальный маршрут
optimal_route, total_cost = find_optimal_route_with_costs(model, graph_data, start_point, points_to_visit)

print("Оптимальный маршрут:")
for i, (idx, point) in enumerate(optimal_route):
    if i == 0:
        print(f"{i+1}. Старт: {point}")
    elif i == len(optimal_route) - 1:
        print(f"{i+1}. Возврат в старт: {point}")
    else:
        print(f"{i+1}. Точка {idx}: {point}")

print(f"Общая стоимость пути: {total_cost:.2f} условных единиц")

# 10. Визуализация оптимального маршрута на карте

# Создаем карту с начальной точкой
m = folium.Map(location=start_point, zoom_start=12)

# Добавляем маркеры для каждой точки маршрута
marker_cluster = MarkerCluster().add_to(m)

# Отображаем маркеры для каждой точки в оптимальном маршруте
for i, (idx, point) in enumerate(optimal_route):
    if i == 0:
        # Стартовая точка - зеленый
        folium.Marker(
            point, 
            popup=f"Старт: {point}", 
            icon=folium.Icon(color='green', icon='play', prefix='fa')
        ).add_to(marker_cluster)
    elif i == len(optimal_route) - 1:
        # Конечная точка (возврат) - красный
        folium.Marker(
            point, 
            popup=f"Возврат: {point}", 
            icon=folium.Icon(color='red', icon='flag-checkered', prefix='fa')
        ).add_to(marker_cluster)
    else:
        # Промежуточные точки - синий с номером
        folium.Marker(
            point, 
            popup=f"Точка {i}: {point}", 
            icon=folium.Icon(color='blue', icon=str(i))
        ).add_to(marker_cluster)

# Добавляем линии оптимального маршрута
route_coords = [point for _, point in optimal_route]
folium.PolyLine(
    route_coords, 
    color="green", 
    weight=3, 
    opacity=0.8,
    popup=f"Оптимальный маршрут (стоимость: {total_cost:.2f})"
).add_to(m)

# Добавляем круги для визуализации порядка посещения
for i, (idx, point) in enumerate(optimal_route[:-1]):  # Не включаем последнюю точку (возврат)
    folium.CircleMarker(
        point,
        radius=8,
        popup=f"Порядок: {i+1}",
        color='yellow',
        fillColor='orange',
        weight=2
    ).add_to(m)

# Сохраняем карту
m.save("optimal_route_with_cost_calculation.html")

print("Карта с оптимальным маршрутом и расчетом стоимости сохранена в 'optimal_route_with_cost_calculation.html'")

# 11. Дополнительная визуализация: матрица стоимости
import matplotlib.pyplot as plt

def visualize_cost_matrix(cost_matrix, points):
    """Визуализирует матрицу стоимости"""
    plt.figure(figsize=(10, 8))
    plt.imshow(cost_matrix, cmap='viridis', interpolation='nearest')
    plt.colorbar(label='Стоимость')
    plt.title('Матрица стоимости путей')
    plt.xlabel('Точки назначения')
    plt.ylabel('Точки отправления')
    
    point_labels = ['Старт'] + [f'Точка {i+1}' for i in range(len(points)-1)]
    plt.xticks(range(len(points)), point_labels, rotation=45)
    plt.yticks(range(len(points)), point_labels)
    
    # Добавляем значения в ячейки
    for i in range(len(points)):
        for j in range(len(points)):
            plt.text(j, i, f'{cost_matrix[i, j]:.1f}', 
                    ha="center", va="center", color="white" if cost_matrix[i, j] > np.max(cost_matrix)/2 else "black")
    
    plt.tight_layout()
    plt.savefig('cost_matrix.png', dpi=300, bbox_inches='tight')
    plt.show()

# Визуализируем матрицу стоимости
all_points = [start_point] + points_to_visit
cost_matrix = create_cost_matrix(model, graph_data, all_points)
visualize_cost_matrix(cost_matrix, all_points)