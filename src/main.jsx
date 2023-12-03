import ReactDOM from "react-dom/client";
import Todos from "./components/todos";
import Header from "./components/header";
export default function Main() {
  return (
    <div>
      <Header />
      <Todos />
    </div>
  );
}

const root = document.getElementById("root");
ReactDOM.createRoot(root).render(<Main />);
