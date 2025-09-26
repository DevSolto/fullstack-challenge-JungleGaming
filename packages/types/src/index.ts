export type Priority = "LOW" | "MEDIUM" | "HIGH" | "URGENT";
export type Status = "TODO" | "IN_PROGRESS" | "REVIEW" | "DONE";

export interface UserDTO {
  id: string;
  email: string;
  username: string;
  createdAt?: string;
}

export interface TokensDTO {
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
}

export interface TaskDTO {
  id: string;
  title: string;
  description?: string;
  dueDate?: string;
  priority: Priority;
  status: Status;
  assignees: string[];
  createdBy: string;
  createdAt: string;
  updatedAt: string;
}

export interface CommentDTO {
  id: string;
  taskId: string;
  authorId: string;
  body: string;
  createdAt: string;
}

export interface NotificationDTO {
  id: string;
  userId: string;
  type: "task:created" | "task:updated" | "comment:new";
  payload: any;
  createdAt: string;
  readAt?: string | null;
}
