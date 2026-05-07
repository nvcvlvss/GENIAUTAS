import { RoadmapItem, type RoadmapItemState } from "@/components/ui/RoadmapItem";
import styles from "./Roadmap.module.css";

export type RoadmapTaskView = {
  id: string;
  title: string;
  state: RoadmapItemState;
};

type RoadmapProps = {
  title?: string;
  tasks: RoadmapTaskView[];
  completedCount?: number;
  onCompleteTask?: (taskId: string) => void;
};

export function Roadmap({
  title = "Mi camino",
  tasks,
  completedCount,
  onCompleteTask,
}: RoadmapProps) {
  const done =
    completedCount ?? tasks.filter((t) => t.state === "done").length;
  const total = tasks.length;

  return (
    <div className={styles.root}>
      <div className={styles.head}>
        <h2 className={styles.title}>{title}</h2>
        <p className={styles.progress}>
          Progreso: {total === 0 ? "0" : `${done}/${total}`} tareas
        </p>
      </div>
      <div className={styles.list}>
        {tasks.map((task) => (
          <RoadmapItem 
            key={task.id} 
            title={task.title} 
            state={task.state} 
            onComplete={onCompleteTask ? () => onCompleteTask(task.id) : undefined}
          />
        ))}
      </div>
    </div>
  );
}
