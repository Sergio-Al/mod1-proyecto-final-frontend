import { useEffect, useState } from "react";

function Tasks() {
  const [tasks, setTasks] = useState([]);

  useEffect(() => {
    const fetchTasks = async () => {
      const token = localStorage.getItem("token");
      const response = await fetch("http://localhost:3000/tareas", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await response.json();
      console.log("Tasks:", data);
      if (response.ok) {
        setTasks(data);
      } else {
        alert("Failed to fetch tasks");
      }
    };

    fetchTasks();
  }, []);

  return (
    <>
      <div className="px-2">
        <div className=" mt-10 overflow-x-auto rounded-box border border-base-content/5 bg-base-100">
          <table className="table">
            {/* head */}
            <thead>
              <tr className="">
                <th className=" px-4 py-2">Título</th>
                <th className=" px-4 py-2">Estado</th>
                <th className=" px-4 py-2">Descripción</th>
                <th className=" px-4 py-2">Fecha Límite</th>
              </tr>
            </thead>
            <tbody>
              {/* row 1 */}
              {tasks.map((task) => (
                <tr
                  key={task.id}
                  className="hover:bg-gray-100 hover:text-gray-700"
                  onClick={() =>
                    document.getElementById("my_modal_1").showModal()
                  }
                >
                  <td className=" px-4 py-2">{task.titulo}</td>
                  <td className=" px-4 py-2">{task.estado}</td>
                  <td className=" px-4 py-2">{task.descripcion}</td>
                  <td className=" px-4 py-2">
                    {new Date(task.fecha_limite).toLocaleDateString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      <dialog id="my_modal_1" className="modal">
        <div className="modal-box">
          <h3 className="font-bold text-lg">Hello!</h3>
          <p className="py-4">
            Press ESC key or click the button below to close
          </p>
          <div className="modal-action">
            <form method="dialog">
              {/* if there is a button in form, it will close the modal */}
              <button className="btn">Close</button>
            </form>
          </div>
        </div>
      </dialog>

      <button
        onClick={() => {
          localStorage.removeItem("token");
          window.location.href = "/login";
        }}
        className="btn btn-primary mt-4"
      >
        Logout
      </button>
    </>
  );
}

export default Tasks;
