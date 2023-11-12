import type { Meta, StoryObj } from '@storybook/react';

import Form from './Form';

const meta = {
  title: '@Common/Form',
  component: Form,
  tags: ['autodocs'],
  decorators: [(Story, { parameters }) => <Story />],
} satisfies Meta<typeof Form>;

export default meta;
type Story = StoryObj<typeof Form>;

export const Primary: Story = {
  args: {},
};
