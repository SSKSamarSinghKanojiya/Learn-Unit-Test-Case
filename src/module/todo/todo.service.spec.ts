import { Test, TestingModule } from '@nestjs/testing';
import { TodoService } from './todo.service';

describe('TodoService', () => {
  let service: TodoService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [TodoService],
    }).compile();

    service = module.get<TodoService>(TodoService);
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('should fetch and return a todo', async () => {
    const mockTodo = {
      userId: 1,
      id: 1,
      title: 'delectus aut autem',
      completed: false,
    };

    // Mock global fetch
    global.fetch = jest.fn().mockResolvedValue({
      json: jest.fn().mockResolvedValue(mockTodo),
    }) as jest.Mock;

    const result = await service.fetchTodo();

    expect(global.fetch).toHaveBeenCalledWith('https://jsonplaceholder.typicode.com/todos/1');
    expect(result).toEqual(mockTodo);
  });
});
