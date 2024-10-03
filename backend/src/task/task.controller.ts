import { Controller, Post, Body, Get, Put, Delete, Param } from '@nestjs/common';
import { TaskService } from './task.service';
import { Task } from './task.entity';

@Controller('tasks')
export class TasksController {
  constructor(private readonly taskService: TaskService) {}

  //rota para criar
  @Post('create')
  async create(@Body() body: { title: string; time: number }): Promise<Task> {
    return this.taskService.create(body.title, body.time);
  }

  //rota para buscar todas tarefa
  @Get()
  async findAll(): Promise<Task[]> {
    return this.taskService.findAll();
  }

  //rota para atualizar uma tarefa como concluida
  @Put(':id')
  async update(@Param('id') id: number, @Body() body: Partial<Task>): Promise<Task> {
    return this.taskService.update(id, body);
  }

  //rota para deletar uma tarefa
  @Delete(':id')
  async remove(@Param('id') id: number): Promise<void> {
    return this.taskService.delete(id);
  }
}
