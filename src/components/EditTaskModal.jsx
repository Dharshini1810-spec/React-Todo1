import React, { useEffect } from "react";
import { Modal, Form, Input, Select, DatePicker, Radio } from "antd";
import dayjs from "dayjs";

const { TextArea } = Input;
const { Option } = Select;

export default function EditTaskModal({ open, task, onSave, onCancel }) {
  const [form] = Form.useForm();

  // Reset/populate fields when open or task changes
  useEffect(() => {
    if (task && open) {
      form.setFieldsValue({
        title: task.title,
        description: task.description,
        priority: task.priority,
        dueDate: task.dueDate ? dayjs(task.dueDate) : null,
        status: task.status,
      });
    }
  }, [task, open, form]);

  const handleOk = () => {
    form
      .validateFields()
      .then((values) => {
        const updatedTask = {
          ...task,
          title: values.title.trim(),
          description: values.description ? values.description.trim() : "",
          priority: values.priority,
          dueDate: values.dueDate ? values.dueDate.format("YYYY-MM-DD") : "",
          status: values.status,
        };
        onSave(updatedTask);
      })
      .catch((info) => {
        console.log("Validation Failed:", info);
      });
  };

  return (
    <Modal
      open={open}
      title={<span style={{ fontWeight: 600, fontSize: "18px" }}>Edit Task Details</span>}
      okText="Save Changes"
      cancelText="Cancel"
      onCancel={onCancel}
      onOk={handleOk}
      destroyOnClose
      okButtonProps={{
        style: {
          borderRadius: "6px",
          background: "linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%)",
          border: "none",
        },
      }}
      cancelButtonProps={{
        style: { borderRadius: "6px" },
      }}
    >
      <Form
        form={form}
        layout="vertical"
        name="edit_task_form"
        style={{ marginTop: "16px" }}
      >
        <Form.Item
          name="title"
          label="Task Title"
          rules={[
            { required: true, message: "Please enter the task title!" },
            { max: 80, message: "Title cannot exceed 80 characters!" },
          ]}
        >
          <Input size="large" />
        </Form.Item>

        <Form.Item
          name="description"
          label="Description"
          rules={[{ max: 500, message: "Description cannot exceed 500 characters!" }]}
        >
          <TextArea rows={3} size="large" />
        </Form.Item>

        <Form.Item
          name="priority"
          label="Priority"
          rules={[{ required: true, message: "Please select priority!" }]}
        >
          <Select size="large">
            <Option value="High">🔴 High</Option>
            <Option value="Medium">🟡 Medium</Option>
            <Option value="Low">🟢 Low</Option>
          </Select>
        </Form.Item>

        <Form.Item name="dueDate" label="Due Date">
          <DatePicker
            style={{ width: "100%" }}
            size="large"
            format="YYYY-MM-DD"
            disabledDate={(current) => current && current < dayjs().startOf("day")}
          />
        </Form.Item>

        <Form.Item
          name="status"
          label="Status"
          rules={[{ required: true, message: "Please select status!" }]}
        >
          <Radio.Group buttonStyle="solid" size="large" style={{ width: "100%" }}>
            <Radio.Button value="Pending" style={{ width: "50%", textAlign: "center" }}>
              ⏳ Pending
            </Radio.Button>
            <Radio.Button value="Completed" style={{ width: "50%", textAlign: "center" }}>
              ✅ Completed
            </Radio.Button>
          </Radio.Group>
        </Form.Item>
      </Form>
    </Modal>
  );
}
