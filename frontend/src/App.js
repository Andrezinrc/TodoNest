import "./App.css";
import { useState, useEffect } from "react";
import axios from 'axios';
import { BsTrash, BsBookmarkCheck, BsBookmarkCheckFill } from 'react-icons/bs';

const API = "http://localhost:3001";

function App() {
  const [title, setTitle] = useState("");
  const [time, setTime] = useState("");
  const [todos, setTodos] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await axios.get(`${API}/tasks`);
        setTodos(response.data);
      } catch (error) {
        console.error('Erro ao carregar tarefas:', error);
        setError('Falha ao carregar as tarefas.');
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError(null);
    setSuccess(null);

    try {
      const response = await axios.post(`${API}/tasks/create`, {
        title,
        time: Number(time)
      });

      setTodos((prevState) => [...prevState, response.data]);
      setSuccess('Tarefa criada com sucesso!');
      setTitle("");
      setTime("");
    } catch (error) {
      console.error('Erro ao criar tarefa:', error);
      setError('Falha ao criar a tarefa.');
    }
  };

  const handleDelete = async (id) => {
    setError(null);
    setSuccess(null);
    try {
      await axios.delete(`${API}/tasks/${id}`);
      setTodos((prevState) => prevState.filter((todo) => todo.id !== id));
      setSuccess('Tarefa deletada com sucesso!');
    } catch (error) {
      console.error('Erro ao deletar tarefa:', error);
      setError('Falha ao deletar a tarefa.');
    }
  };

  const handleEdit = async (todo) => {
    setError(null);
    setSuccess(null);
    try {
      const updatedTodo = { ...todo, done: !todo.done };
      const response = await axios.put(`${API}/tasks/${todo.id}`, updatedTodo);
      setTodos((prevState) =>
        prevState.map((t) => (t.id === todo.id ? response.data : t))
      );
      setSuccess('Tarefa atualizada com sucesso!');
    } catch (error) {
      console.error('Erro ao atualizar tarefa:', error);
      setError('Falha ao atualizar a tarefa.');
    }
  };

  if (loading) {
    return <p className="carregamento">Carregando...</p>
  }

  return (
    <div className="App">
      <header className="cabecalho">
        <h1>React Tarefa</h1>
      </header>
      
      <main className="principal">
        <h2>Insira sua próxima tarefa!</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-control">
            <label htmlFor="title">O que você vai fazer?</label>
            <input
              type="text"
              name="title"
              placeholder="Título da tarefa"
              onChange={(event) => setTitle(event.target.value)}
              value={title}
              required
            />
          </div>
          <div className="form-control">
            <label htmlFor="time">Duração:</label>
            <input
              type="number"
              name="time"
              placeholder="Tempo estimado (em horas)"
              onChange={(event) => setTime(event.target.value)}
              value={time}
              required
            />
          </div>
          <input type="submit" value="Criar tarefa" />

          {error && <p className="error">{error}</p>}
          {success && <p className="success">{success}</p>}
        </form>
      </main>

      <footer className="rodape-list">
        {todos.length === 0 && <p>Não há tarefas</p>}
        {todos.map((todo) => (
          <div className="todo" key={todo.id}>
            <h3 className={todo.done ? "todo-done" : ""}>
              {todo.title}
            </h3>
            <p>Duração: {todo.time}h</p>
            <div className="actions">
              <span onClick={() => handleEdit(todo)}>
                {!todo.done ? <BsBookmarkCheck /> : <BsBookmarkCheckFill />}
              </span>
              <BsTrash onClick={() => handleDelete(todo.id)} />
            </div>
          </div>
        ))}
      </footer>
    </div>
  );
}

export default App;
