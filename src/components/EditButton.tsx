import { EditOutlined } from '@ant-design/icons';
import { Button } from 'antd';

export default function EditButton({ handleEdit }: { readonly handleEdit: () => void }) {
	return <Button icon={<EditOutlined />} type='default' shape='circle' onClick={handleEdit} title='Edit'></Button>;
}
