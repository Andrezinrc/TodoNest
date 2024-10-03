import { Injectable } from '@nestjs/common';
import { Task } from './task.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class TaskService {
  constructor(
    @InjectRepository(Task)
    private readonly taskRepository: Repository<Task>,
  ) {}

  // Cria tarefa
  async create(title: string, time: number): Promise<Task> {
    try {
      const task = this.taskRepository.create({ title, time, done: false });
      return await this.taskRepository.save(task);
    } catch (error) {
      console.log('Erro ao criar tarefa:', error);
      throw error;
    }
  }

  // Obtém todas as tarefas
  async findAll(): Promise<Task[]> {
    try {
      return await this.taskRepository.find();
    } catch (error) {
      console.log('Erro ao buscar tarefas:', error);
      throw error;
    }
  }

  // Atualiza tarefa
  async update(id: number, updateData: Partial<Task>): Promise<Task> {
    try {
      await this.taskRepository.update(id, updateData);
      const updatedTask = await this.taskRepository.findOne({ where: { id } });
      if (!updatedTask) {
        throw new Error('Tarefa não encontrada');
      }
      return updatedTask;
    } catch (error) {
      console.log('Erro ao atualizar tarefa:', error);
      throw error;
    }
  }

  // Deleta tarefa
  async delete(id: number): Promise<void> {
    try {
      const result = await this.taskRepository.delete(id);
      if (result.affected === 0) {
        throw new Error('Tarefa não encontrada para deletar');
      }
    } catch (error) {
      console.log('Erro ao deletar tarefa:', error);
      throw error;
    }
  }
}
