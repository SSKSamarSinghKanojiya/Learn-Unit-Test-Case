import { Injectable } from '@nestjs/common';

@Injectable()
export class TodoService {
  async fetchTodo() {
    const response = await fetch('https://jsonplaceholder.typicode.com/todos/1');
    const data = await response.json();
    console.log(data);
    
    return data
  }
}
