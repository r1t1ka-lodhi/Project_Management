export const UserRolesEnum = {
    ADMIN: "admin",
    PROJECT_ADMIN : "project_admin",
    MEMBER: "member",
};

export const AvailableUserRole = Object.values(UserRolesEnum);

export const TaskStatusEnum = {
    TODO: "ToDo",
    IN_PROGRESS: "In_Progress",
    DONE: "Done"
}

export const AvailableTaskStatus = Object.values(TaskStatusEnum);

export const TaskPriorityEnum = {
    LOW: "Low",
    MEDIUM: "Medium",
    HIGH: "High"
}

export const AvailableTaskPriority = Object.values(TaskPriorityEnum);
export const DateFormat = "YYYY-MM-DD";
export const DateTimeFormat = "YYYY-MM-DD HH:mm:ss";