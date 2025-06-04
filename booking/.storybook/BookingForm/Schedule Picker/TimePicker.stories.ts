import type { Meta, StoryObj } from '@storybook/react';
import { userEvent, within } from '@storybook/testing-library';
import TimePicker from '../../../src/_components/Booking Form/Schedule Picker/TimePicker';
import { mockUnavailability } from '../utils/mockData';

const meta: Meta<typeof TimePicker> = {
    title: 'BookingForm/Schedule Picker/TimePicker',
    component: TimePicker,
    parameters: {
        layout: 'centered',
        a11y: {
            config: {
                rules: [
                    { id: 'listbox', enabled: true },
                    { id: 'combobox', enabled: true }
                ]
            }
        }
    },
    argTypes: {
        onChange: { action: 'time changed' }
    },
    tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof TimePicker>;

export const DefaultTime: Story = {
    args: {
        name: 'service_time',
        selectedTime: '',
        onChange: () => {},
        unavailableTimes: [],
        disabled: false,
        serviceDate: new Date(),
        serviceType: 'boarding'
    },
    play: async ({ canvasElement }) => {
        const canvas = within(canvasElement);
        const select = canvas.getByRole('combobox');
        await userEvent.click(select);
    }
};

// Add remaining stories...
