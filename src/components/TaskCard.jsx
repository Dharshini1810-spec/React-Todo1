import React from "react";
import { Card, Tag, Button, Tooltip, Popconfirm, Checkbox, Space, Typography } from "antd";
import {
  EditOutlined,
  DeleteOutlined,
  CalendarOutlined,
  CheckCircleOutlined,
  ClockCircleOutlined,
} from "@ant-design/icons";
import dayjs from "dayjs";

const { Paragraph, Text } = Typography;

export default function TaskCard({ task, onToggleStatus, onEdit, onDelete }) {
  const isCompleted = task.status === "Completed";
  const isOverdue =
    task.dueDate &&
    dayjs(task.dueDate).isBefore(dayjs(), "day") &&
    !isCompleted;
  const isDueToday =
    task.dueDate &&
    dayjs(task.dueDate).isSame(dayjs(), "day") &&
    !isCompleted;

  // Define tag colors based on Priority
  const getPriorityTag = (priority) => {
    switch (priority) {
      case "High":
        return <Tag color="error">High</Tag>;
      case "Medium":
        return <Tag color="warning">Medium</Tag>;
      case "Low":
        return <Tag color="success">Low</Tag>;
      default:
        return <Tag color="default">{priority}</Tag>;
    }
  };

  const getDueDateStyle = () => {
    if (isCompleted) return { color: "rgba(0, 0, 0, 0.45)" };
    if (isOverdue) return { color: "#ff4d4f", fontWeight: "bold" };
    if (isDueToday) return { color: "#faad14", fontWeight: "bold" };
    return { color: "rgba(0, 0, 0, 0.45)" };
  };

  return (
    <Card
      hoverable
      className={`task-card ${isCompleted ? "task-card-completed" : ""}`}
      style={{
        borderRadius: "12px",
        borderLeft: isCompleted
          ? "5px solid #52c41a"
          : task.priority === "High"
          ? "5px solid #ff4d4f"
          : task.priority === "Medium"
          ? "5px solid #faad14"
          : "5px solid #52c41a",
        boxShadow: "0 4px 6px -1px rgba(0,0,0,0.05), 0 2px 4px -1px rgba(0,0,0,0.03)",
        transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
      }}
      actions={[
        <Tooltip title={isCompleted ? "Mark as Pending" : "Mark as Completed"}>
          <Button
            type="text"
            icon={
              isCompleted ? (
                <CheckCircleOutlined style={{ color: "#52c41a", fontSize: "17px" }} />
              ) : (
                <ClockCircleOutlined style={{ color: "#8c8c8c", fontSize: "17px" }} />
              )
            }
            onClick={() => onToggleStatus(task.id)}
          />
        </Tooltip>,
        <Tooltip title="Edit Task">
          <Button
            type="text"
            icon={<EditOutlined style={{ color: "#1890ff", fontSize: "17px" }} />}
            onClick={() => onEdit(task)}
          />
        </Tooltip>,
        <Popconfirm
          title="Delete Task"
          description="Are you sure you want to delete this task?"
          onConfirm={() => onDelete(task.id)}
          okText="Yes"
          cancelText="No"
          okButtonProps={{ danger: true }}
        >
          <Tooltip title="Delete Task">
            <Button
              type="text"
              icon={<DeleteOutlined style={{ color: "#ff4d4f", fontSize: "17px" }} />}
              danger
            />
          </Tooltip>
        </Popconfirm>,
      ]}
    >
      <div className="task-card-content">
        <div className="task-card-header" style={{ marginBottom: "12px" }}>
          <Space align="center" style={{ width: "100%", justifyContent: "space-between" }}>
            <Checkbox
              checked={isCompleted}
              onChange={() => onToggleStatus(task.id)}
            />
            {getPriorityTag(task.priority)}
          </Space>
        </div>

        <Text
          strong
          delete={isCompleted}
          style={{
            fontSize: "16px",
            color: isCompleted ? "rgba(0,0,0,0.45)" : "rgba(0,0,0,0.85)",
            display: "block",
            marginBottom: "8px",
            wordBreak: "break-word",
          }}
        >
          {task.title}
        </Text>

        <Paragraph
          ellipsis={{ rows: 2, expandable: true, symbol: "more" }}
          style={{
            color: isCompleted ? "rgba(0,0,0,0.35)" : "rgba(0,0,0,0.65)",
            fontSize: "14px",
            marginBottom: "16px",
            minHeight: "42px",
            wordBreak: "break-word",
          }}
        >
          {task.description || <Text type="secondary" italic>No description provided.</Text>}
        </Paragraph>

        {task.dueDate && (
          <div className="task-card-footer" style={getDueDateStyle()}>
            <Space size={6} align="center">
              <CalendarOutlined />
              <span>
                {isCompleted
                  ? `Completed (Due: ${task.dueDate})`
                  : isOverdue
                  ? `Overdue: ${task.dueDate}`
                  : isDueToday
                  ? `Due Today: ${task.dueDate}`
                  : `Due: ${task.dueDate}`}
              </span>
            </Space>
          </div>
        )}
      </div>
    </Card>
  );
}
