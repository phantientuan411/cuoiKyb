import React, { useState } from 'react';
import { Form, Input, Button, Radio, Row, Col, message } from 'antd';
import axios from 'axios';

import { SaveOutlined } from '@ant-design/icons';

const AddTeacherPosition = ({ onClose }) => {
    const [form] = Form.useForm();

    const API_ENDPOINT = 'http://localhost:8698';
    const [loading, setLoading] = useState(false);

    const onFinish = async (values) => {
        setLoading(true);

        const preparedData = {
            name: values.name,
            code: values.code,
            des: values.description, 
            status: values.status === 'active', 
        };

        try {
            const response = await axios.post(
                `${API_ENDPOINT}/teacherPosition/newTeacherPosition`,
                preparedData
            );

            if (response.status === 201 || response.status === 200) {
                const messageSuccess = response.data?.message || 'Tạo vị trí công tác thành công!';
                message.success(messageSuccess);
                form.resetFields();
                if (onClose) onClose(); ó
            } else {
                const messageError = response.data?.message || 'Có lỗi xảy ra khi tạo vị trí.';
                message.error(`Lỗi: ${messageError}`);
            }
        } catch (error) {
            const messageError = error.response?.data?.message || 'Không thể kết nối đến máy chủ.';
            console.error("Lỗi POST vị trí công tác:", error);
            message.error(`Thất bại: ${messageError}`);
        } finally {
            setLoading(false);
        }
    };

    const onFinishFailed = (errorInfo) => {
        console.log('Failed:', errorInfo);
        message.error('Vui lòng điền đầy đủ và chính xác các trường bắt buộc.');
    };

    return (
        <div style={{ padding: '20px' }}>
            <h1 style={{ fontSize: '20px', fontWeight: '600', marginBottom: '24px', color: '#333' }}>
                Vị trí công tác
            </h1>

            <Form
                form={form}
                name="add_teacher_position_form"
                layout="vertical"
                onFinish={onFinish}
                onFinishFailed={onFinishFailed}
                initialValues={{ status: 'active' }}
            >
                <Form.Item
                    label={<span><span style={{ color: 'red' }}>*</span> Tên</span>}
                    name="name"
                    rules={[{ required: true, message: 'Vui lòng nhập Tên!' }]}
                >
                    <Input placeholder="Nhập tên vị trí" />
                </Form.Item>
                <Form.Item
                    label={<span><span style={{ color: 'red' }}>*</span> Mã</span>}
                    name="code"
                    rules={[{ required: true, message: 'Vui lòng nhập Mã!' }]}
                >
                    <Input placeholder="Nhập mã vị trí" />
                </Form.Item>

                <Form.Item
                    label={<span><span style={{ color: 'red' }}>*</span> Mô tả</span>}
                    name="description"
                    rules={[{ required: true, message: 'Vui lòng nhập Mô tả!' }]}
                >
                    <Input.TextArea
                        placeholder="Nhập mô tả vị trí"
                        rows={4}
                    />
                </Form.Item>

                <Form.Item
                    label={<span><span style={{ color: 'red' }}>*</span> Trạng thái</span>}
                    name="status"
                    rules={[{ required: true, message: 'Vui lòng chọn trạng thái!' }]}
                >
                    <Radio.Group>
                        <Radio.Button value="active">Hoạt động</Radio.Button>
                        <Radio.Button value="inactive">Ngừng</Radio.Button>
                    </Radio.Group>
                </Form.Item>

                <Row justify="end" style={{ marginTop: '20px' }}>
                    <Col>
                        <Button
                            type="primary"
                            htmlType="submit"
                            loading={loading}
                            icon={<SaveOutlined />}
                        >
                            Lưu
                        </Button>
                    </Col>
                </Row>
            </Form>
        </div>
    );
};

export default AddTeacherPosition;