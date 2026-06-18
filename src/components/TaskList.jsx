import React, { useState } from "react";
import { Table, Card, Row, Col, Segmented, Empty, Space, Tag, Checkbox, Button, Tooltip, Popconfirm, Typography } from "antd";
import { AppstoreOutlined, UnorderedListOutlined, EditOutlined, DeleteOutlined } from "@ant-design/icons";
import TaskCard from "./TaskCard";
import dayjs from "dayjs";

const { Text } = Typography;

export default function TaskList({ tasks, onToggleStatus, onEdit, onDelete }) {
  const [viewType, setViewType] = useState("Grid");

  // Define table columns
  const columns = [
    {
      title: "Status",
      key: "status",
      width: 80,
      align: "center",
      render: (_, record) => (
        <Checkbox
          checked={record.status === "Completed"}
          onChange={() => onToggleStatus(record.id)}
        />
      ),
    },
    {
      title: "Task Title",
      dataIndex: "title",
      key: "title",
      sorter: (a, b) => a.title.localeCompare(b.title),
      render: (text, record) => (
        <Text delete={record.status === "Completed"} strong style={{ color: record.status === "Completed" ? "rgba(0,0,0,0.45)" : "rgba(0,0,0,0.85)" }}>
          {text}
        </Text>
      ),
    },
    {
      title: "Description",
      dataIndex: "description",
      key: "description",
      ellipsis: true,
      render: (text) => text || <span style={{ color: "rgba(0,0,0,0.3)", fontStyle: "italic" }}>No description</span>,
    },
    {
      title: "Priority",
      dataIndex: "priority",
      key: "priority",
      width: 110,
      sorter: (a, b) => {
        const order = { High: 3, Medium: 2, Low: 1 };
        return order[a.priority] - order[b.priority];
      },
      render: (priority) => {
        switch (priority) {
          case "High":
            return <Tag color="error">High</Tag>;
          case "Medium":
            return <Tag color="warning">Medium</Tag>;
          case "Low":
            return <Tag color="success">Low</Tag>;
          default:
            return <Tag>{priority}</Tag>;
        }
      },
    },
    {
      title: "Due Date",
      dataIndex: "dueDate",
      key: "dueDate",
      width: 140,
      sorter: (a, b) => {
        if (!a.dueDate) return 1;
        if (!b.dueDate) return -1;
        return dayjs(a.dueDate).unix() - dayjs(b.dueDate).unix();
      },
      render: (date, record) => {
        if (!date) return <span style={{ color: "rgba(0,0,0,0.3)" }}>-</span>;
        const isCompleted = record.status === "Completed";
        const isOverdue = dayjs(date).isBefore(dayjs(), "day") && !isCompleted;
        const isDueToday = dayjs(date).isSame(dayjs(), "day") && !isCompleted;

        let color = "inherit";
        let weight = "normal";

        if (!isCompleted) {
          if (isOverdue) {
            color = "#ff4d4f";
            weight = "bold";
          } else if (isDueToday) {
            color = "#faad14";
            weight = "bold";
          }
        }

        return <span style={{ color, fontWeight: weight }}>{date}</span>;
      },
    },
    {
      title: "Actions",
      key: "actions",
      width: 120,
      align: "center",
      render: (_, record) => (
        <Space size="middle">
          <Tooltip title="Edit">
            <Button
              type="text"
              icon={<EditOutlined style={{ color: "#1890ff" }} />}
              onClick={() => onEdit(record)}
            />
          </Tooltip>
          <Popconfirm
            title="Delete task"
            description="Are you sure you want to delete this task?"
            onConfirm={() => onDelete(record.id)}
            okText="Yes"
            cancelText="No"
            okButtonProps={{ danger: true }}
          >
            <Tooltip title="Delete">
              <Button
                type="text"
                icon={<DeleteOutlined style={{ color: "#ff4d4f" }} />}
                danger
              />
            </Tooltip>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <div className="task-list-container">
      <div
        className="list-actions-bar"
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "20px",
        }}
      >
        <Text type="secondary">
          Showing {tasks.length} task{tasks.length !== 1 ? "s" : ""}
        </Text>
        <Segmented
          options={[
            {
              label: "Grid",
              value: "Grid",
              icon: <AppstoreOutlined />,
            },
            {
              label: "Table",
              value: "Table",
              icon: <UnorderedListOutlined />,
            },
          ]}
          value={viewType}
          onChange={setViewType}
        />
      </div>

      {tasks.length === 0 ? (
        <Card style={{ borderRadius: "12px", padding: "40px 0" }} bordered={false}>
          <Empty description="No tasks match the active filters or search terms." />
        </Card>
      ) : viewType === "Grid" ? (
        <Row gutter={[16, 16]}>
          {tasks.map((task) => (
            <Col xs={24} sm={12} md={12} lg={12} xl={8} key={task.id}>
              <TaskCard
                task={task}
                onToggleStatus={onToggleStatus}
                onEdit={onEdit}
                onDelete={onDelete}
              />
            </Col>
          ))}
        </Row>
      ) : (
        <Table
          dataSource={tasks}
          columns={columns}
          rowKey="id"
          pagination={{ pageSize: 6 }}
          bordered={false}
          style={{
            background: "#fff",
            borderRadius: "12px",
            boxShadow: "0 4px 6px -1px rgba(0,0,0,0.05)",
          }}
          className="custom-task-table"
        />
      )}
    </div>
  );
}
