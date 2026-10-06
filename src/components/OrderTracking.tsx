
import React from 'react';
import { OrderStatus } from '../types';
import { Package, Truck, CheckCircle, Box } from 'lucide-react';

interface OrderTrackingProps {
    status: OrderStatus;
    estimatedDelivery?: string;
}

const OrderTracking: React.FC<OrderTrackingProps> = ({ status, estimatedDelivery }) => {
    const steps = [
        { label: 'Order Placed', icon: Box, key: 'Placed' },
        { label: 'Packaging', icon: Package, key: 'Packaging' },
        { label: 'Dispatched', icon: Truck, key: 'Dispatched' },
        { label: 'Delivered', icon: CheckCircle, key: 'Delivered' },
    ];

    const currentStepIndex = steps.findIndex(s => s.key === status);

    return (
        <div className="w-full py-6">
            <div className="flex items-center justify-between relative px-4">
                {/* Connecting Line */}
                <div className="absolute top-1/2 left-0 w-full h-1 bg-gray-200 -z-10 transform -translate-y-1/2" />
                <div
                    className="absolute top-1/2 left-0 h-1 bg-green-500 -z-10 transform -translate-y-1/2 transition-all duration-500"
                    style={{ width: `${(currentStepIndex / (steps.length - 1)) * 100}%` }}
                />

                {steps.map((step, index) => {
                    const isCompleted = index <= currentStepIndex;
                    const isCurrent = index === currentStepIndex;
                    const Icon = step.icon;

                    return (
                        <div key={step.key} className="flex flex-col items-center bg-white p-2">
                            <div
                                className={`w-10 h-10 rounded-full flex items-center justify-center border-2 transition-all duration-300 
                                ${isCompleted ? 'bg-green-500 border-green-500 text-white' : 'bg-white border-gray-300 text-gray-400'}`}
                            >
                                <Icon className="w-5 h-5" />
                            </div>
                            <span
                                className={`text-xs font-semibold mt-2 ${isCurrent ? 'text-green-600' : 'text-gray-500'}`}
                            >
                                {step.label}
                            </span>
                        </div>
                    );
                })}
            </div>
            {estimatedDelivery && (
                <div className="text-center mt-6 text-sm text-gray-500">
                    Estimated Delivery: <span className="font-semibold text-gray-800">{estimatedDelivery}</span>
                </div>
            )}
        </div>
    );
};

export default OrderTracking;
