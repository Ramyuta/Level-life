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
};

// Preset colors
export const SKIN_TONES = [
    '#F4C2A0', // Light
    '#E8B897', // Light-Medium
    '#D4A574', // Medium
    '#C68642', // Medium-Dark
    '#8D5524', // Dark
    '#5C3317', // Very Dark
];

export const HAIR_COLORS = [
    '#2C1B18', // Black
    '#4A3728', // Dark Brown
    '#8B5A3C', // Brown
    '#D4A574', // Light Brown
    '#E6C45C', // Blonde
    '#FF6B35', // Red
    '#9B59B6', // Purple
    '#3498DB', // Blue
    '#95A5A6', // Gray
    '#ECF0F1', // White
];

export const CLOTHING_COLORS = [
    '#4F46E5', // Indigo
    '#EF4444', // Red
    '#10B981', // Green
    '#F59E0B', // Amber
    '#8B5CF6', // Purple
    '#EC4899', // Pink
    '#06B6D4', // Cyan
    '#000000', // Black
    '#FFFFFF', // White
    '#6B7280', // Gray
];
