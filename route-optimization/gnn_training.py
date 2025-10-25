import torch
import torch.nn as nn
from torch_geometric.data import Data
from torch_geometric.nn import GCNConv
import pandas as pd

# 1. Загружаем данные
data = pd.read_csv("data_clean.csv")

# 2. Создание списка узлов и рёбер для графа
node_features = []
edge_index = []
edge_attr = []
node_map = {}

# Составляем список узлов (координаты точек)
for i, row in data.iterrows():
    from_node = (row['from_lat'], row['from_lon'])
    to_node = (row['to_lat'], row['to_lon'])
    
    if from_node not in node_map:
        node_map[from_node] = len(node_features)
        node_features.append([row['from_lat'], row['from_lon']])
    
    if to_node not in node_map:
        node_map[to_node] = len(node_features)
        node_features.append([row['to_lat'], row['to_lon']])
    
    from_node_idx = node_map[from_node]
    to_node_idx = node_map[to_node]
    
    # Добавляем рёбра (с индексами узлов)
    edge_index.append([from_node_idx, to_node_idx])
    edge_attr.append(row['predicted_time_min'])

# Преобразуем данные в тензоры для PyTorch Geometric
edge_index = torch.tensor(edge_index, dtype=torch.long).t().contiguous()
edge_attr = torch.tensor(edge_attr, dtype=torch.float)
node_features = torch.tensor(node_features, dtype=torch.float)

# Создаем объект Data для PyTorch Geometric
graph_data = Data(x=node_features, edge_index=edge_index, edge_attr=edge_attr)

# 3. Определение модели GNN
class GNN(nn.Module):
    def __init__(self, in_channels, hidden_channels, out_channels):
        super(GNN, self).__init__()
        self.conv1 = GCNConv(in_channels, hidden_channels)
        self.conv2 = GCNConv(hidden_channels, out_channels)
    
    def forward(self, x, edge_index, edge_attr):
        # Пропуск через первый слой GCN
        x = self.conv1(x, edge_index, edge_attr)
        x = torch.relu(x)
        
        # Пропуск через второй слой GCN
        x = self.conv2(x, edge_index, edge_attr)
        
        return x

# 4. Инициализация модели
model = GNN(in_channels=2, hidden_channels=64, out_channels=1)

# 5. Определение функции потерь и оптимизатора
criterion = nn.MSELoss()  # Мы будем минимизировать время в пути
optimizer = torch.optim.Adam(model.parameters(), lr=0.01)

# 6. Обучение модели
def train(model, data, epochs=100):
    model.train()
    for epoch in range(epochs):
        optimizer.zero_grad()
        
        # Прогнозирование через модель
        out = model(data.x, data.edge_index, data.edge_attr)
        
        # Здесь можно использовать вашу целевую функцию (например, предсказание минимального времени)
        loss = criterion(out, torch.zeros_like(out))  # Псевдопотери для примера
        loss.backward()
        optimizer.step()
        
        if epoch % 10 == 0:
            print(f'Epoch {epoch+1}/{epochs}, Loss: {loss.item()}')

# 7. Сохранение модели
def save_model(model, filename):
    torch.save(model.state_dict(), filename)

# 8. Загрузка модели
def load_model(model, filename):
    model.load_state_dict(torch.load(filename))
    model.eval()

# 9. Тестирование модели (поиск маршрута)
def test_route(model, data, start_point, points_to_visit):
    model.eval()
    route = []
    current_point = start_point
    
    # Найдем оптимальный путь для каждой точки, которую нужно посетить
    for next_point in points_to_visit:
        # Предсказание пути с учетом следующей точки
        out = model(data.x, data.edge_index, data.edge_attr)
        
        # Пример: Предсказать минимальное время для следующей точки
        # Здесь можно реализовать поиск кратчайшего пути или оценку маршрута
        # В этом примере мы просто возвращаем следующий шаг
        route.append(next_point)
        current_point = next_point
    
    return route

# 10. Запуск обучения
train(model, graph_data)

# 11. Сохранение обученной модели
save_model(model, 'gnn_model.pth')

# 12. Загрузка модели
load_model(model, 'gnn_model.pth')

# Пример данных для теста
start_point = (47.21805, 39.697207)  # Пример стартовой точки
points_to_visit = [(47.217621, 39.707611), (47.221096, 39.690970)]  # Пример точек для посещения

# 13. Получаем оптимальный маршрут
route = test_route(model, graph_data, start_point, points_to_visit)
print("Оптимальный маршрут:", route)
