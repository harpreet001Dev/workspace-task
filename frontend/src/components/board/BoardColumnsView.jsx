import BoardColumn from "./BoardColumn";

const BoardColumnsView = ({
    boardColumns,
    taskLoading,
    taskMenuOpenId,
    setTaskMenuOpenId,
    openCreateTaskModal,
    openViewTaskModal,
    openEditTaskModal,
    handleDeleteTask,
}) => (
    <div className="grid gap-4 xl:grid-cols-4">
        {boardColumns.map((column) => (
            <BoardColumn
                key={column._id}
                column={column}
                taskLoading={taskLoading}
                taskMenuOpenId={taskMenuOpenId}
                setTaskMenuOpenId={setTaskMenuOpenId}
                openCreateTaskModal={openCreateTaskModal}
                openViewTaskModal={openViewTaskModal}
                openEditTaskModal={openEditTaskModal}
                handleDeleteTask={handleDeleteTask}
            />
        ))}
    </div>
);

export default BoardColumnsView;
