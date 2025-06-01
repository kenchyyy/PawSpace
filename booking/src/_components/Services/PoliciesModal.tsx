import React, { useRef, useEffect } from 'react';
import { PoliciesModalProps } from './types/serviceTypes';

export default function PoliciesModal({ isOpen, onClose, title, content }: PoliciesModalProps) {
    const modalRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (isOpen && modalRef.current && !modalRef.current.contains(event.target as Node)) {
                onClose();
            }
        }
        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [isOpen, onClose]);

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/0 flex items-center justify-center z-[60] backdrop-blur-none font-sans">
            <div ref={modalRef} className={`bg-white text-black p-6 rounded-2xl w-[90%] max-w-md shadow-sm animate-fade-in max-h-[90vh] overflow-hidden`} onClick={(e) => e.stopPropagation()}>
                <div className="flex items-center justify-between mb-4">
                    <h2 className="text-2xl font-bold text-gray-800">{title}</h2>
                    <button
                        onClick={onClose}
                        className="text-gray-500 hover:text-gray-700 text-xl cursor-pointer transition duration-300 ease-in-out transform hover:scale-110 rounded-full p-1"
                        aria-label="Close"
                    >
                        ✖
                    </button>
                </div>
                <div className="space-y-4 text-sm text-gray-700 overflow-y-auto pr-2 pb-4" style={{ maxHeight: 'calc(90vh - 100px)' }}>
                    {content.map((paragraph, index) => {
                        const boldedParagraph = paragraph.replace(
                            /^(\d+\.\s[A-Za-z0-9&\s/()-]+:)/,
                            '<strong>$1</strong>'
                        );
                        return <p key={index} dangerouslySetInnerHTML={{ __html: boldedParagraph }} />;
                    })}
                </div>
            </div>
        </div>
    );
}