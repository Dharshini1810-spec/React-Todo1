import React from "react";
import { Card, Form, Input, Select, DatePicker, Button, Space } from "antd";
import { PlusCircleOutlined, ClearOutlined } from "@ant-design/icons";
import dayjs from "dayjs";

const { TextArea } = Input;
const { Option } = Select;

export default function TaskForm({ onAddTask }) {
  const [form] = Form.useForm();

  const handleSubmit = (values) => {
    const newTask = {
      id: Date.now().toString(),
      title: values.title.trim(),
      description: values.description ? values.description.trim() : "",
      priority: values.priority,
      dueDate: values.dueDate ? values.dueDate.format("YYYY-MM-DD") : "",
      status: "Pending", // default to Pending
      createdAt: new Date().toISOString(),
    };

    onAddTask(newTask);
    form.resetFields();
  };

  const handleReset = () => {
    form.resetFields();
  };

  return (
    <Card
      title={
        <Space>
          <PlusCircleOutlined style={{ color: "#4f46e5" }} />
          <span style={{ fontWeight: 600 }}>Create New Task</span>
        </Space>
      }
      bordered={false}
      className="task-form-card"
      style={{
        boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.05), 0 4px 6px -2px rgba(0, 0, 0, 0.05)",
        borderRadius: "12px",
      }}
    >
      <Form
        form={form}
        layout="vertical"
        onFinish={handleSubmit}
        initialValues={{
          priority: "Medium",
          dueDate: dayjs().add(1, "day"),
        }}
      >
        <Form.Item
          label="Task Title"
          name="title"
          rules={[
            { required: true, message: "Please enter the task title!" },
            { max: 80, message: "Title cannot exceed 80 characters!" },
          ]}
        >
          <Input placeholder="What needs to be done?" size="large" />
        </Form.Item>

        <Form.Item
          label="Description"
          name="description"
          rules={[{ max: 500, message: "Description cannot exceed 500 characters!" }]}
        >
          <TextArea
            rows={3}
            placeholder="Add some details about this task..."
            size="large"
          />
        </Form.Item>

        <Form.Item
          label="Priority"
          name="priority"
          rules={[{ required: true, message: "Please select task priority!" }]}
        >
          <Select size="large">
            <Option value="High">🔴 High</Option>
            <Option value="Medium">🟡 Medium</Option>
            <Option value="Low">🟢 Low</Option>
          </Select>
        </Form.Item>

        <Form.Item label="Due Date" name="dueDate">
          <DatePicker
            style={{ width: "100%" }}
            size="large"
            format="YYYY-MM-DD"
            disabledDate={(current) => current && current < dayjs().startOf("day")}
          />
        </Form.Item>

        <Form.Item style={{ marginBottom: 0 }}>
          <Space style={{ width: "100%", justifyContent: "flex-end" }}>
            <Button
              icon={<ClearOutlined />}
              onClick={handleReset}
              size="large"
              style={{ borderRadius: "8px" }}
            >
              Clear
            </Button>
            <Button
              type="primary"
              htmlType="submit"
              icon={<PlusCircleOutlined />}
              size="large"
              style={{
                borderRadius: "8px",
                background: "linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%)",
                border: "none",
              }}
            >
              Add Task
            </Button>
          </Space>
        </Form.Item>
      </Form>
    </Card>
  );
}
