import { useEffect, useState } from 'react';
import { Card, Tabs, Tag, Descriptions, Empty, Spin, Pagination } from 'antd';
import { UserOutlined, TeamOutlined, CalendarOutlined, BookOutlined } from '@ant-design/icons';

function App() {
    const [teachers, setTeachers] = useState([]);
    const [teacherPositions, setTeacherPositions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [pagination, setPagination] = useState({
        currentPage: 1,
        totalPages: 1,
        totalTeachers: 0,
        limit: 10
    });

    const url = 'http://localhost:8698';

    const fetchTeachers = async (page = 1, limit = 10) => {
        try {
            setLoading(true);
            const response = await fetch(`${url}/teachers?page=${page}&limit=${limit}`);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const data = await response.json();
            setTeachers(data.data || []);
            setPagination(data.pagination || {});
        } catch (error) {
            console.error("Lỗi khi fetch teachers:", error);
        } finally {
            setLoading(false);
        }
    };

    const fetchTeacherPositions = async () => {
        try {
            const response = await fetch(`${url}/teacherPosition`);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const data = await response.json();
            setTeacherPositions(data.data || []);
        } catch (error) {
            console.error("Lỗi khi fetch teacherPositions:", error);
        }
    };

    useEffect(() => {
        fetchTeachers();
        fetchTeacherPositions();
    }, []);
    console.log(teacherPositions);
    
    const handlePageChange = (page, pageSize) => {
        fetchTeachers(page, pageSize);
    };

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('vi-VN', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit'
        });
    };

    const TeacherCard = ({ teacher }) => (
        <Card
            className="mb-4 hover:shadow-lg transition-shadow duration-300"
            hoverable
        >
            <div className="flex items-start justify-between">
                <div className="flex-1">
                    <div className="flex items-center gap-3 mb-3">

                        <div>
                            <h3 className="text-lg font-semibold text-gray-800">
                                Mã GV: {teacher.code}
                            </h3>

                        </div>
                    </div>

                    <Descriptions column={2} size="small">
                        <Descriptions.Item label={<span className="font-medium">Chức vụ</span>}>
                            <span className="flex items-center gap-1">
                                <TeamOutlined className="text-purple-500" />
                                {teacher.teacherPositionsId?.name || 'Chưa có chức vụ'}
                            </span>
                        </Descriptions.Item>
                        <Descriptions.Item label={<span className="font-medium">Mã chức vụ</span>}>
                            <Tag color="purple">
                                {teacher.teacherPositionsId?.code || 'N/A'}
                            </Tag>
                        </Descriptions.Item>
                        <Descriptions.Item label={<span className="font-medium">Ngày bắt đầu</span>}>
                            <span className="flex items-center gap-1">
                                <CalendarOutlined className="text-blue-500" />
                                {formatDate(teacher.startDate)}
                            </span>
                        </Descriptions.Item>
                        <Descriptions.Item label={<span className="font-medium">Trạng thái</span>}>
                            <Tag color={teacher.isActive ? "green" : "red"}>
                                {teacher.isActive ? "Hoạt động" : "Không hoạt động"}
                            </Tag>
                        </Descriptions.Item>
                        <Descriptions.Item label={<span className="font-medium">Số bằng cấp</span>}>
                            <span className="flex items-center gap-1">
                                <BookOutlined className="text-orange-500" />
                                {teacher.degrees?.length || 0}
                            </span>
                        </Descriptions.Item>
                        <Descriptions.Item label={<span className="font-medium">Vai trò</span>}>
                            <Tag color="cyan">
                                {teacher.userId?.role || 'N/A'}
                            </Tag>
                        </Descriptions.Item>
                    </Descriptions>

                    {teacher.degrees && teacher.degrees.length > 0 && (
                        <div className="mt-3 p-3 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg border border-blue-100">
                            <p className="text-sm font-semibold text-gray-700 mb-2 flex items-center gap-1">
                                <BookOutlined className="text-blue-500" />
                                Bằng cấp:
                            </p>
                            <div className="space-y-2">
                                {teacher.degrees.map((degree, index) => (
                                    <div key={index} className="bg-white p-2 rounded shadow-sm">
                                        <div className="flex items-start justify-between">
                                            <div className="flex-1">
                                                <Tag color="processing" className="mb-1">
                                                    {degree.type || 'Loại bằng'}
                                                </Tag>
                                                <p className="text-sm font-medium text-gray-800">
                                                    {degree.school || 'Chưa có trường'}
                                                </p>
                                                <p className="text-xs text-gray-600">
                                                    Chuyên ngành: {degree.major || 'N/A'}
                                                </p>
                                                <p className="text-xs text-gray-500">
                                                    Năm: {degree.year || 'N/A'}
                                                </p>
                                            </div>
                                            {degree.isGraduated && (
                                                <Tag color="green" className="ml-2">Đã tốt nghiệp</Tag>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </Card>
    );

    const PositionCard = ({ position }) => (
        <Card
            className="mb-4 hover:shadow-lg transition-shadow duration-300"
            hoverable
        >
            <div className="flex items-start gap-4">
                <div className="w-16 h-16 rounded-lg bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white text-2xl font-bold shadow-md">
                    {position.code?.substring(0, 2) || 'CV'}
                </div>
                <div className="flex-1">
                    <h3 className="text-xl font-bold text-gray-800 mb-2">
                        {position.name}
                    </h3>
                    <Tag color="purple" className="mb-2">
                        {position.code}
                    </Tag>
                    <p className="text-gray-600 mb-3">{position.des}</p>

                    <div className="flex gap-2">
                        <Tag color={position.isActive ? "green" : "red"}>
                            {position.isActive ? "Đang hoạt động" : "Ngừng hoạt động"}
                        </Tag>
                        <Tag color={position.isDeleted ? "volcano" : "blue"}>
                            {position.isDeleted ? "Đã xóa" : "Chưa xóa"}
                        </Tag>
                    </div>
                </div>
            </div>
        </Card>
    );

    const tabItems = [
        {
            key: '1',
            label: (
                <span className="flex items-center gap-2 px-2">
                    <UserOutlined />
                    <span>Giáo viên ({pagination.totalTeachers || 0})</span>
                </span>
            ),
            children: (
                <div>
                    {loading ? (
                        <div className="flex justify-center items-center py-20">
                            <Spin size="large" />
                        </div>
                    ) : teachers.length > 0 ? (
                        <>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {teachers.map(teacher => (
                                    <TeacherCard key={teacher._id} teacher={teacher} />
                                ))}
                            </div>
                            <div className="mt-6 flex justify-center">
                                <Pagination
                                    current={pagination.currentPage}
                                    total={pagination.totalTeachers}
                                    pageSize={pagination.limit}
                                    onChange={handlePageChange}
                                    showSizeChanger
                                    showTotal={(total) => `Tổng ${total} giáo viên`}
                                    pageSizeOptions={['10', '20', '50']}
                                />
                            </div>
                        </>
                    ) : (
                        <Empty description="Không có dữ liệu giáo viên" />
                    )}
                </div>
            )
        },
        {
            key: '2',
            label: (
                <span className="flex items-center gap-2 px-2">
                    <TeamOutlined />
                    <span>Chức vụ ({teacherPositions.length})</span>
                </span>
            ),
            children: (
                <div>
                    {teacherPositions.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            {teacherPositions.map(position => (
                                <PositionCard key={position._id} position={position} />
                            ))}
                        </div>
                    ) : (
                        <Empty description="Không có dữ liệu chức vụ" />
                    )}
                </div>
            )
        }
    ];

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 p-6">
            <div className="max-w-7xl mx-auto">
                <div className="mb-8">
                    <h1 className="text-4xl font-bold text-gray-800 mb-2">
                        Quản lý Giáo viên
                    </h1>
                    <p className="text-gray-600">
                        Xem và quản lý thông tin giáo viên và chức vụ
                    </p>
                </div>

                <Card className="shadow-xl">
                    <Tabs
                        defaultActiveKey="1"
                        items={tabItems}
                        size="large"
                        className="custom-tabs"
                    />
                </Card>
            </div>
        </div>
    );
}

export default App;