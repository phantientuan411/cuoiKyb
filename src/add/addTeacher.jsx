import React, { useEffect, useState } from 'react';
import {
    Form,
    Input,
    Button,
    Row,
    Col,
    DatePicker,
    Select,
    Upload,
    Divider,
} from 'antd';
import {
    UploadOutlined,
    PlusOutlined,
    MinusCircleOutlined
} from '@ant-design/icons';
import axios from 'axios';
import moment from "moment";

const API_ENDPOINT = 'http://localhost:8698';

const degreeTypeOptions = [
    { value: 'Bachelor', label: 'Cử nhân' },
    { value: 'Master', label: 'Thạc sĩ' },
    { value: 'PhD', label: 'Tiến sĩ' },
];

const TeacherRegistrationForm = ({ initialData = {} }) => {
    const [loading, setLoading] = useState(false);
    const [teacherPositions, setTeacherPositions] = useState([]);
    const [message, setMessage] = useState(false);
    const showMessage = () => {
        setMessage(true)
    }
    const [form] = Form.useForm();

    const fetchTeacherPositions = async () => {
        try {
            const response = await fetch(`${API_ENDPOINT}/teacherPosition`);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);

            }
            const data = await response.json();
            setTeacherPositions(data.data || []);
        } catch (error) {
            console.error("Lỗi khi fetch teacherPositions:", error);
            message.error("Không thể tải danh sách vị trí công tác.");
        }
    };

    useEffect(() => {
        fetchTeacherPositions();
    }, []);

    const positionOptions = teacherPositions.map(position => ({
        value: position._id,
        label: position.name,
    }));

    const onFinish = async (formData) => {
        setLoading(true);
        const preparedData = {
            ...formData,
            dob: formData.dob ? formData.dob.format('YYYY-MM-DD') : undefined,
            teacherPositionsId: formData.teacherPositionsId,
            degrees: (formData.degrees || []).map(degree => ({
                ...degree,
                year: degree.year ? degree.year.year() : undefined,
                isGraduated: degree.isGraduated === 'true'
            })),
            startDate: moment().format('YYYY-MM-DD'),
            isActive: true,
            isDeleted: false,
        };


        try {
            const response = await axios.post(`${API_ENDPOINT}/teachers/newTeacher`, preparedData);

            if (response.status === 201 || response.status === 200) {
                const messageSuccess = response.data?.message;
                setMessage(messageSuccess)
                message.success(messageSuccess);
                form.resetFields();
            } else {
                message.error(`Lỗi: ${response.data.message || 'Có lỗi xảy ra.'}`);


            }
        } catch (error) {
            const messageError = (error.response?.data?.message);
            setMessage(messageError)

            console.log(messageError);
            message.error(`Thất bại: ${messageError || 'Không thể kết nối đến máy chủ.'}`);
        } finally {
            setLoading(false);
        }
    };

    const onFinishFailed = (errorInfo) => {
        console.log('Validation Failed:', errorInfo);
        message.warning('Vui lòng kiểm tra lại các trường bị lỗi.');
    };

    const uploadProps = {
        name: 'file',
        action: 'your-image-upload-url',
        headers: {
            authorization: 'authorization-text',
        },
        onChange(info) {
            if (info.file.status !== 'uploading') {
                console.log(info.file, info.fileList);
            }
            if (info.file.status === 201) {
                message.success(`${info.file.name} đã tải lên thành công`);
            } else if (info.file.status === 409 || 400 || 500) {
                message.error(`${info.file.name} tải lên thất bại.`);
            }
        },
    };

    return (
        <div className="p-8 bg-white shadow-xl rounded-lg">
            <div className='flex w-auto'>
                <h1 className="text-xl font-semibold mb-6 text-gray-800">Tạo thông tin giáo viên</h1>
                <h1>{message && (
                    <div className="bg-green-100 border border-green-400 text-red-700 px-4 py-3 rounded relative mb-4">
                        {message}
                    </div>
                    )} 
                </h1>
            </div>
            <Form
                form={form}
                name="teacher_form"
                onFinish={onFinish}
                onFinishFailed={onFinishFailed}
                layout="vertical"
                initialValues={{
                    degrees: initialData.degrees || [{}],
                }}
            >
                <Row gutter={40}>
                    <Col span={6} className="text-center">
                        <div className="mb-4">
                            <img
                                src="placeholder-avatar.png"
                                alt="Avatar"
                                className="w-24 h-24 mx-auto mb-2 rounded-full border border-gray-200 object-cover"
                            />
                        </div>
                        <Upload {...uploadProps} maxCount={1}>
                            <Button icon={<UploadOutlined />}>
                                Upload file
                            </Button>
                        </Upload>
                        <p className="mt-1 text-sm text-gray-500">Chọn ảnh</p>
                    </Col>

                    <Col span={18}>
                        <h3 className="text-lg font-medium mb-4 text-gray-700">Thông tin cá nhân</h3>
                        <Row gutter={16}>
                            <Col span={12}>
                                <Form.Item
                                    label={<span className="font-semibold">* Họ và tên</span>}
                                    name="name"
                                    rules={[{ required: true, message: 'Vui lòng nhập họ và tên!' }]}
                                >
                                    <Input placeholder="VD: Nguyễn Văn A" />
                                </Form.Item>
                            </Col>
                            <Col span={12}>
                                <Form.Item
                                    label={<span className="font-semibold">* Ngày sinh</span>}
                                    name="dob"
                                    rules={[{ required: true, message: 'Vui lòng chọn ngày sinh!' }]}
                                >
                                    <DatePicker format="YYYY-MM-DD" style={{ width: '100%' }} placeholder="Chọn ngày sinh" />
                                </Form.Item>
                            </Col>
                            <Col span={12}>
                                <Form.Item
                                    label={<span className="font-semibold">* Số điện thoại</span>}
                                    name="phoneNumber"
                                    rules={[{ required: true, message: 'Vui lòng nhập số điện thoại!' }]}
                                >
                                    <Input placeholder="Nhập số điện thoại" />
                                </Form.Item>
                            </Col>
                            <Col span={12}>
                                <Form.Item
                                    label={<span className="font-semibold">* Email</span>}
                                    name="email"
                                    rules={[
                                        { required: true, message: 'Vui lòng nhập Email!' },
                                        { type: 'email', message: 'Email không hợp lệ!' },
                                    ]}
                                >
                                    <Input placeholder="email@school.edu.vn" />
                                </Form.Item>
                            </Col>
                            <Col span={12}>
                                <Form.Item
                                    label={<span className="font-semibold">* Số CCCD</span>}
                                    name="identity"
                                    rules={[{ required: true, message: 'Vui lòng nhập số CCCD!' }]}
                                >
                                    <Input placeholder="Nhập số CCCD" />
                                </Form.Item>
                            </Col>
                            <Col span={12}>
                                <Form.Item
                                    label={<span className="font-semibold">Địa chỉ</span>}
                                    name="address"
                                >
                                    <Input placeholder="Địa chỉ thường trú" />
                                </Form.Item>
                            </Col>
                        </Row>
                    </Col>
                </Row>

                <Divider />

                <h3 className="text-lg font-medium mb-4 text-gray-700">Thông tin công tác</h3>
                <Row gutter={16}>
                    <Col span={24}>
                        <Form.Item
                            label={<span className="font-semibold">* Vị trí công tác</span>}
                            name="teacherPositionsId"
                            rules={[{ required: true, message: 'Vui lòng chọn vị trí công tác!' }]}
                        >
                            <Select
                                placeholder="Chọn các vị trí công tác"
                                options={positionOptions}
                            />
                        </Form.Item>
                    </Col>
                </Row>

                <Divider />

                <h3 className="text-lg font-medium mb-4 text-gray-700">Học vị</h3>
                <Form.List name="degrees">
                    {(fields, { add, remove }) => (
                        <>
                            <div className="mb-2">
                                <Row className="bg-gray-100 p-2 rounded-t font-semibold text-gray-600">
                                    <Col span={4}>Bậc</Col>
                                    <Col span={6}>Trường</Col>
                                    <Col span={5}>Chuyên ngành</Col>
                                    <Col span={3}>Trạng thái</Col>
                                    <Col span={4}>Tốt nghiệp (Năm)</Col>
                                    <Col span={2}></Col>
                                </Row>
                            </div>

                            {fields.map(({ key, name, fieldKey, ...restField }) => (
                                <Row key={key} gutter={8} align="top" className="mb-2">
                                    <Col span={4}>
                                        <Form.Item
                                            {...restField}
                                            name={[name, 'type']}
                                            fieldKey={[fieldKey, 'type']}
                                            rules={[{ required: true, message: 'Chọn bậc' }]}
                                            style={{ width: 'auto' }}
                                        >
                                            <Select placeholder="Bậc" options={degreeTypeOptions} />
                                        </Form.Item>
                                    </Col>

                                    <Col span={6}>
                                        <Form.Item
                                            {...restField}
                                            name={[name, 'school']}
                                            fieldKey={[fieldKey, 'school']}
                                            rules={[{ required: true, message: 'Nhập trường' }]}
                                            style={{ width: 'auto' }}
                                        >
                                            <Input placeholder="Tên trường" />
                                        </Form.Item>
                                    </Col>
                                    <Col span={5}>
                                        <Form.Item
                                            {...restField}
                                            name={[name, 'major']}
                                            fieldKey={[fieldKey, 'major']}
                                            rules={[{ required: true, message: 'Nhập ngành' }]}
                                            style={{ width: 'auto' }}
                                        >
                                            <Input placeholder="Chuyên ngành" />
                                        </Form.Item>
                                    </Col>
                                    <Col span={3}>
                                        <Form.Item
                                            {...restField}
                                            name={[name, 'isGraduated']}
                                            fieldKey={[fieldKey, 'isGraduated']}
                                            rules={[{ required: true, message: 'Chọn trạng thái' }]}
                                            style={{ width: 'auto' }}
                                        >
                                            <Select placeholder="Trạng thái">
                                                <Select.Option value="true">Đã tốt nghiệp</Select.Option>
                                                <Select.Option value="false">Đang học</Select.Option>
                                            </Select>
                                        </Form.Item>
                                    </Col>

                                    <Col span={4}>
                                        <Form.Item
                                            {...restField}
                                            name={[name, 'year']}
                                            fieldKey={[fieldKey, 'year']}
                                            rules={[{ required: true, message: 'Chọn năm' }]}
                                            style={{ width: 'auto' }}
                                        >
                                            <DatePicker
                                                picker="year"
                                                placeholder="Năm"
                                                style={{ width: '100%' }}
                                            />
                                        </Form.Item>
                                    </Col>

                                    <Col span={2}>
                                        <MinusCircleOutlined onClick={() => remove(name)} className="cursor-pointer text-red-500 hover:text-red-700" />
                                    </Col>
                                </Row>
                            ))}

                            <Form.Item>
                                <Button
                                    type="dashed"
                                    onClick={() => add()}
                                    block
                                    icon={<PlusOutlined />}
                                >
                                    Thêm Học Vị
                                </Button>
                            </Form.Item>
                        </>
                    )}
                </Form.List>

                <Row justify="end" className="mt-8">
                    <Col>
                        <Form.Item className="mb-0">
                            <Button
                                type="primary"
                                htmlType="submit"
                                onClick={showMessage}
                                loading={loading}
                                className="bg-blue-600 hover:bg-blue-700 transition duration-150"
                            >
                                {loading ? 'Đang Lưu...' : 'LƯU'}
                            </Button>
                        </Form.Item>
                    </Col>
                </Row>
            </Form>
        </div>
    );
};

export default TeacherRegistrationForm;