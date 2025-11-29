import type {RegisterFormData} from "../../../types";
import {Form, type FormInstance, Input} from "antd";

interface StepProps {
    form: FormInstance<RegisterFormData>;
}

const Verify_Account = ({form}: StepProps) => {
  return (
      <Form form={form} layout="vertical" size="large">
          <Form.Item
              name="email"
              label="Email"
              rules={[{ required: true, type: 'email', message: 'Email không hợp lệ!' }]}
          >
              <Input />
          </Form.Item>
          <Form.Item
              name="password"
              label="Mật khẩu"
              rules={[{ required: true, min: 6, message: 'Mật khẩu phải có ít nhất 6 ký tự!' }]}
          >
              <Input.Password />
          </Form.Item>
          <Form.Item
              name="confirmPassword"
              label="Xác nhận Mật khẩu"
              dependencies={['password']}
              hasFeedback
              rules={[
                  { required: true, message: 'Vui lòng xác nhận mật khẩu!' },
                  ({ getFieldValue }) => ({
                      validator(_, value) {
                          if (!value || getFieldValue('password') === value) {
                              return Promise.resolve();
                          }
                          return Promise.reject(new Error('Hai mật khẩu không khớp!'));
                      },
                  }),
              ]}
          >
              <Input.Password />
          </Form.Item>
      </Form>
  );
};
export default Verify_Account;