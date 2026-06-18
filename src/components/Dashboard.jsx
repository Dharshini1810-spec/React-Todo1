import React, { useState, useEffect } from "react";
import { Row, Col, Card, Statistic, Progress, Input, Select, Space, Button, message, Layout } from "antd";
import {
  SearchOutlined,
  FilterOutlined,
  UndoOutlined,
  CheckCircleTwoTone,
  HourglassTwoTone,
  AlertTwoTone,
  ProfileTwoTone,
} from "@ant-design/icons";
import Header from "./Header";
import TaskForm from "./TaskForm";
import TaskList from "./TaskList";
import EditTaskModal from "./EditTaskModal";
import dayjs from "dayjs";

const { Content } = Layout;
const { Option } = Select;

export default function Dashboard() {
  // Load tasks from Local Storage on initial load
  const [tasks, setTasks] = useState(() => {
    try {
      const savedTasks = localStorage.getItem("taskflow_tasks");
      return savedTasks ? JSON.parse(savedTasks) : [];
    } catch (error) {
      console.error("Failed to load tasks from local storage", error);
      return [];
    }
  });

  // Search and Filter states
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [priorityFilter, setPriorityFilter] = useState("All");

  // Edit modal state
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [taskToEdit, setTaskToEdit] = useState(null);

  // Sync tasks to Local Storage
  useEffect(() => {
    localStorage.setItem("taskflow_tasks", JSON.stringify(tasks));
  }, [tasks]);

  // CRUD Actions
  const handleAddTask = (newTask) => {
    setTasks((prevTasks) => [newTask, ...prevTasks]);
    message.success({ content: `Task "${newTask.title}" created!`, duration: 2 });
  };

  const handleUpdateTask = (updatedTask) => {
    setTasks((prevTasks) =>
      prevTasks.map((t) => (t.id === updatedTask.id ? updatedTask : t))
    );
    setEditModalOpen(false);
    setTaskToEdit(null);
    message.success({ content: "Task updated successfully!", duration: 2 });
  };

  const handleDeleteTask = (taskId) => {
    const taskToDelete = tasks.find((t) => t.id === taskId);
    setTasks((prevTasks) => prevTasks.filter((t) => t.id !== taskId));
    message.error({
      content: `Task "${taskToDelete?.title || ""}" deleted!`,
      duration: 2,
    });
  };

  const handleToggleStatus = (taskId) => {
    setTasks((prevTasks) =>
      prevTasks.map((t) => {
        if (t.id === taskId) {
          const newStatus = t.status === "Completed" ? "Pending" : "Completed";
          const statusMsg =
            newStatus === "Completed" ? "Marked as Completed!" : "Marked as Pending!";
          message.info({ content: statusMsg, duration: 1.5 });
          return { ...t, status: newStatus };
        }
        return t;
      })
    );
  };

  const handleEditClick = (task) => {
    setTaskToEdit(task);
    setEditModalOpen(true);
  };

  const handleResetFilters = () => {
    setSearchQuery("");
    setStatusFilter("All");
    priorityFilter !== "All" && setPriorityFilter("All");
    message.info({ content: "Filters reset!", duration: 1 });
  };

  // Calculations for Statistics
  const totalTasks = tasks.length;
  const completedTasks = tasks.filter((t) => t.status === "Completed").length;
  const pendingTasks = tasks.filter((t) => t.status === "Pending").length;
  const overdueTasks = tasks.filter(
    (t) =>
      t.status === "Pending" &&
      t.dueDate &&
      dayjs(t.dueDate).isBefore(dayjs(), "day")
  ).length;

  const completionRate = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

  // Filter and Search logic
  const filteredTasks = tasks.filter((task) => {
    const matchesSearch =
      task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      task.description.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus =
      statusFilter === "All" || task.status === statusFilter;

    const matchesPriority =
      priorityFilter === "All" || task.priority === priorityFilter;

    return matchesSearch && matchesStatus && matchesPriority;
  });

  return (
    <Layout style={{ minHeight: "100vh", background: "#f8fafc" }}>
      <Header />

      <Content style={{ padding: "32px", maxWidth: "1400px", width: "100%", margin: "0 auto" }}>
        {/* Statistics Row */}
        <Row gutter={[16, 16]} style={{ marginBottom: "32px" }}>
          <Col xs={24} sm={12} md={6}>
            <Card bordered={false} className="stat-card">
              <Statistic
                title="Total Tasks"
                value={totalTasks}
                prefix={<ProfileTwoTone twoToneColor="#4f46e5" style={{ marginRight: 8 }} />}
              />
            </Card>
          </Col>
          <Col xs={24} sm={12} md={6}>
            <Card bordered={false} className="stat-card">
              <Statistic
                title="Completed"
                value={completedTasks}
                valueStyle={{ color: "#52c41a" }}
                prefix={<CheckCircleTwoTone twoToneColor="#52c41a" style={{ marginRight: 8 }} />}
              />
            </Card>
          </Col>
          <Col xs={24} sm={12} md={6}>
            <Card bordered={false} className="stat-card">
              <Statistic
                title="Pending"
                value={pendingTasks}
                valueStyle={{ color: "#1890ff" }}
                prefix={<HourglassTwoTone twoToneColor="#1890ff" style={{ marginRight: 8 }} />}
              />
            </Card>
          </Col>
          <Col xs={24} sm={12} md={6}>
            <Card bordered={false} className="stat-card">
              <Statistic
                title="Overdue Tasks"
                value={overdueTasks}
                valueStyle={{ color: overdueTasks > 0 ? "#ff4d4f" : "inherit" }}
                prefix={<AlertTwoTone twoToneColor="#ff4d4f" style={{ marginRight: 8 }} />}
              />
            </Card>
          </Col>
        </Row>

        <Row gutter={[24, 24]}>
          {/* Left panel: Task Creation Form */}
          <Col xs={24} lg={8}>
            <TaskForm onAddTask={handleAddTask} />
            {totalTasks > 0 && (
              <Card
                bordered={false}
                style={{
                  marginTop: "24px",
                  borderRadius: "12px",
                  textAlign: "center",
                  boxShadow: "0 10px 15px -3px rgba(0,0,0,0.05)",
                }}
              >
                <div style={{ fontWeight: 600, color: "rgba(0,0,0,0.45)", marginBottom: "12px" }}>
                  Completion Progress
                </div>
                <Progress type="circle" percent={completionRate} strokeColor={{ "0%": "#4f46e5", "100%": "#52c41a" }} />
              </Card>
            )}
          </Col>

          {/* Right panel: Controls & Task List */}
          <Col xs={24} lg={16}>
            <Card
              bordered={false}
              style={{
                borderRadius: "12px",
                marginBottom: "24px",
                boxShadow: "0 4px 6px -1px rgba(0,0,0,0.05)",
              }}
            >
              <Row gutter={[16, 16]} align="middle">
                {/* Search */}
                <Col xs={24} md={10}>
                  <Input
                    placeholder="Search task title or description..."
                    prefix={<SearchOutlined style={{ color: "rgba(0,0,0,0.25)" }} />}
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    size="large"
                    allowClear
                  />
                </Col>

                {/* Status Filter */}
                <Col xs={12} md={5}>
                  <Select
                    placeholder="Filter Status"
                    style={{ width: "100%" }}
                    value={statusFilter}
                    onChange={setStatusFilter}
                    size="large"
                  >
                    <Option value="All">All Statuses</Option>
                    <Option value="Pending">⏳ Pending</Option>
                    <Option value="Completed">✅ Completed</Option>
                  </Select>
                </Col>

                {/* Priority Filter */}
                <Col xs={12} md={5}>
                  <Select
                    placeholder="Filter Priority"
                    style={{ width: "100%" }}
                    value={priorityFilter}
                    onChange={setPriorityFilter}
                    size="large"
                  >
                    <Option value="All">All Priorities</Option>
                    <Option value="High">🔴 High</Option>
                    <Option value="Medium">🟡 Medium</Option>
                    <Option value="Low">🟢 Low</Option>
                  </Select>
                </Col>

                {/* Reset Filters */}
                <Col xs={24} md={4}>
                  <Button
                    icon={<UndoOutlined />}
                    onClick={handleResetFilters}
                    style={{ width: "100%", borderRadius: "8px" }}
                    size="large"
                  >
                    Reset
                  </Button>
                </Col>
              </Row>
            </Card>

            {/* Task list render */}
            <TaskList
              tasks={filteredTasks}
              onToggleStatus={handleToggleStatus}
              onEdit={handleEditClick}
              onDelete={handleDeleteTask}
            />
          </Col>
        </Row>

        {/* Edit Task Modal */}
        <EditTaskModal
          open={editModalOpen}
          task={taskToEdit}
          onSave={handleUpdateTask}
          onCancel={() => {
            setEditModalOpen(false);
            setTaskToEdit(null);
          }}
        />
      </Content>
    </Layout>
  );
}
