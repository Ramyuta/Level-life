// Custom Avatar Types
export interface CustomAvatar {
    faceShape: 'circle' | 'square' | 'rounded' | 'oval';
    skinTone: string; // hex color
    eyes: 'normal' | 'happy' | 'wink' | 'closed' | 'surprised';
    eyeColor: string; // hex color
    eyebrows: 'normal' | 'raised' | 'angry' | 'sad' | 'thin';
    nose: 'small' | 'medium' | 'large' | 'button';
    mouth: 'smile' | 'neutral' | 'grin' | 'sad' | 'smirk';
    hair: 'short' | 'long' | 'bald' | 'curly' | 'spiky' | 'wavy' | 'buzz' | 'ponytail';
    hairColor: string; // hex color
    facialHair?: 'none' | 'beard' | 'mustache' | 'goatee';
    facialHairColor?: string; // hex color
    accessory?: 'none' | 'glasses' | 'sunglasses' | 'hat' | 'headphones' | 'earrings';
    accessoryColor?: string; // hex color
    clothing: 'tshirt' | 'hoodie' | 'shirt' | 'sweater';
    clothingColor: string; // hex color
    backgroundColor?: string; // hex color
}

export const DEFAULT_CUSTOM_AVATAR: CustomAvatar = {
    faceShape: 'circle',
    skinTone: '#F4C2A0',
    eyes: 'normal',
    eyeColor: '#4A3728',
    eyebrows: 'normal',
    nose: 'medium',
    mouth: 'smile',
    hair: 'short',
    hairColor: '#2C1B18',
    facialHair: 'none',
    facialHairColor: '#2C1B18',
    accessory: 'none',
    accessoryColor: '#000000',
    clothing: 'tshirt',
    clothingColor: '#4F46E5',
    backgroundColor: '#F3F4F6',
};

// Preset colors
export const SKIN_TONES = [
    '#FFDFC4', // Very Light
    '#F4C2A0', // Light
    '#E8B897', // Light-Medium
    '#D4A574', // Medium
    '#C68642', // Medium-Dark
    '#8D5524', // Dark
    '#5C3317', // Very Dark
    '#3E2723', // Deep Dark
];

export const HAIR_COLORS = [
    '#090806', // Black
    '#2C1B18', // Soft Black
    '#4A3728', // Dark Brown
    '#6D4C41', // Medium Brown
    '#8B5A3C', // Brown
    '#A1887F', // Light Brown
    '#D4A574', // Sandy
    '#E6C45C', // Blonde
    '#FFF9C4', // Platinum Blonde
    '#FF6B35', // Red
    '#A52A2A', // Auburn
    '#9B59B6', // Purple
    '#3498DB', // Blue
    '#2ECC71', // Green
    '#E91E63', // Pink
    '#95A5A6', // Gray
    '#ECF0F1', // White
];

export const CLOTHING_COLORS = [
    '#EF4444', // Red
    '#F97316', // Orange
    '#F59E0B', // Amber
    '#10B981', // Emerald
    '#06B6D4', // Cyan
    '#3B82F6', // Blue
    '#4F46E5', // Indigo
    '#8B5CF6', // Violet
    '#EC4899', // Pink
    '#F43F5E', // Rose
    '#111827', // Gray 900
    '#4B5563', // Gray 600
    '#9CA3AF', // Gray 400
    '#FFFFFF', // White
];

export const BACKGROUND_COLORS = [
    '#F3F4F6', // Gray
    '#FEE2E2', // Red
    '#FFEDD5', // Orange
    '#FEF3C7', // Amber
    '#D1FAE5', // Emerald
    '#CFFAFE', // Cyan
    '#DBEAFE', // Blue
    '#E0E7FF', // Indigo
    '#EDE9FE', // Violet
    '#FCE7F3', // Pink
    '#FFE4E6', // Rose
    '#1F2937', // Dark Gray
    '#1E1B4B', // Dark Indigo
];
