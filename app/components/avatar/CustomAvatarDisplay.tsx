"use client";

import React from 'react';
import type { CustomAvatar } from '../../lib/customAvatarTypes';

interface CustomAvatarDisplayProps {
    avatar: CustomAvatar;
    size?: number;
    className?: string;
}

export default function CustomAvatarDisplay({
    avatar,
    size = 200,
    className = '',
}: CustomAvatarDisplayProps) {
    const {
        faceShape,
        skinTone,
        eyes,
        eyeColor,
        eyebrows,
        nose,
        mouth,
        hair,
        hairColor,
        facialHair,
        facialHairColor,
        accessory,
        accessoryColor,
        clothing,
        clothingColor,
    } = avatar;

    // Face paths based on shape
    const getFacePath = () => {
        switch (faceShape) {
            case 'circle':
                return 'M100,40 A60,60 0 1,1 100,160 A60,60 0 1,1 100,40';
            case 'square':
                return 'M60,40 H140 V160 H60 Z';
            case 'rounded':
                return 'M70,40 H130 Q140,40 140,50 V150 Q140,160 130,160 H70 Q60,160 60,150 V50 Q60,40 70,40';
            case 'oval':
                return 'M100,30 A50,70 0 1,1 100,170 A50,70 0 1,1 100,30';
            default:
                return 'M100,40 A60,60 0 1,1 100,160 A60,60 0 1,1 100,40';
        }
    };

    // Eyes based on type
    const renderEyes = () => {
        const eyeY = 85;
        const leftEyeX = 75;
        const rightEyeX = 125;

        switch (eyes) {
            case 'normal':
                return (
                    <>
                        <ellipse cx={leftEyeX} cy={eyeY} rx="8" ry="12" fill={eyeColor} />
                        <ellipse cx={rightEyeX} cy={eyeY} rx="8" ry="12" fill={eyeColor} />
                        <circle cx={leftEyeX} cy={eyeY} r="3" fill="white" opacity="0.6" />
                        <circle cx={rightEyeX} cy={eyeY} r="3" fill="white" opacity="0.6" />
                    </>
                );
            case 'happy':
                return (
                    <>
                        <path d={`M${leftEyeX - 10},${eyeY} Q${leftEyeX},${eyeY - 5} ${leftEyeX + 10},${eyeY}`} stroke={eyeColor} strokeWidth="3" fill="none" strokeLinecap="round" />
                        <path d={`M${rightEyeX - 10},${eyeY} Q${rightEyeX},${eyeY - 5} ${rightEyeX + 10},${eyeY}`} stroke={eyeColor} strokeWidth="3" fill="none" strokeLinecap="round" />
                    </>
                );
            case 'wink':
                return (
                    <>
                        <ellipse cx={leftEyeX} cy={eyeY} rx="8" ry="12" fill={eyeColor} />
                        <circle cx={leftEyeX} cy={eyeY} r="3" fill="white" opacity="0.6" />
                        <path d={`M${rightEyeX - 10},${eyeY} Q${rightEyeX},${eyeY - 5} ${rightEyeX + 10},${eyeY}`} stroke={eyeColor} strokeWidth="3" fill="none" strokeLinecap="round" />
                    </>
                );
            case 'closed':
                return (
                    <>
                        <line x1={leftEyeX - 10} y1={eyeY} x2={leftEyeX + 10} y2={eyeY} stroke={eyeColor} strokeWidth="3" strokeLinecap="round" />
                        <line x1={rightEyeX - 10} y1={eyeY} x2={rightEyeX + 10} y2={eyeY} stroke={eyeColor} strokeWidth="3" strokeLinecap="round" />
                    </>
                );
            case 'surprised':
                return (
                    <>
                        <circle cx={leftEyeX} cy={eyeY} r="10" fill={eyeColor} />
                        <circle cx={rightEyeX} cy={eyeY} r="10" fill={eyeColor} />
                        <circle cx={leftEyeX} cy={eyeY} r="4" fill="white" opacity="0.6" />
                        <circle cx={rightEyeX} cy={eyeY} r="4" fill="white" opacity="0.6" />
                    </>
                );
            default:
                return null;
        }
    };

    // Eyebrows
    const renderEyebrows = () => {
        const browY = 70;
        const leftBrowX = 75;
        const rightBrowX = 125;

        switch (eyebrows) {
            case 'normal':
                return (
                    <>
                        <path d={`M${leftBrowX - 12},${browY} Q${leftBrowX},${browY - 2} ${leftBrowX + 12},${browY}`} stroke={hairColor} strokeWidth="3" fill="none" strokeLinecap="round" />
                        <path d={`M${rightBrowX - 12},${browY} Q${rightBrowX},${browY - 2} ${rightBrowX + 12},${browY}`} stroke={hairColor} strokeWidth="3" fill="none" strokeLinecap="round" />
                    </>
                );
            case 'raised':
                return (
                    <>
                        <path d={`M${leftBrowX - 12},${browY + 3} Q${leftBrowX},${browY - 5} ${leftBrowX + 12},${browY}`} stroke={hairColor} strokeWidth="3" fill="none" strokeLinecap="round" />
                        <path d={`M${rightBrowX - 12},${browY} Q${rightBrowX},${browY - 5} ${rightBrowX + 12},${browY + 3}`} stroke={hairColor} strokeWidth="3" fill="none" strokeLinecap="round" />
                    </>
                );
            case 'angry':
                return (
                    <>
                        <path d={`M${leftBrowX - 12},${browY - 3} L${leftBrowX + 12},${browY + 3}`} stroke={hairColor} strokeWidth="3" strokeLinecap="round" />
                        <path d={`M${rightBrowX - 12},${browY + 3} L${rightBrowX + 12},${browY - 3}`} stroke={hairColor} strokeWidth="3" strokeLinecap="round" />
                    </>
                );
            case 'sad':
                return (
                    <>
                        <path d={`M${leftBrowX - 12},${browY} Q${leftBrowX},${browY + 3} ${leftBrowX + 12},${browY}`} stroke={hairColor} strokeWidth="3" fill="none" strokeLinecap="round" />
                        <path d={`M${rightBrowX - 12},${browY} Q${rightBrowX},${browY + 3} ${rightBrowX + 12},${browY}`} stroke={hairColor} strokeWidth="3" fill="none" strokeLinecap="round" />
                    </>
                );
            case 'thin':
                return (
                    <>
                        <line x1={leftBrowX - 12} y1={browY} x2={leftBrowX + 12} y2={browY} stroke={hairColor} strokeWidth="2" strokeLinecap="round" />
                        <line x1={rightBrowX - 12} y1={browY} x2={rightBrowX + 12} y2={browY} stroke={hairColor} strokeWidth="2" strokeLinecap="round" />
                    </>
                );
            default:
                return null;
        }
    };

    // Nose
    const renderNose = () => {
        const noseX = 100;
        const noseY = 105;

        switch (nose) {
            case 'small':
                return <ellipse cx={noseX} cy={noseY} rx="3" ry="5" fill={skinTone} opacity="0.3" />;
            case 'medium':
                return <ellipse cx={noseX} cy={noseY} rx="5" ry="8" fill={skinTone} opacity="0.3" />;
            case 'large':
                return <ellipse cx={noseX} cy={noseY} rx="7" ry="10" fill={skinTone} opacity="0.3" />;
            case 'button':
                return <circle cx={noseX} cy={noseY} r="4" fill={skinTone} opacity="0.3" />;
            default:
                return null;
        }
    };

    // Mouth
    const renderMouth = () => {
        const mouthY = 130;
        const mouthX = 100;

        switch (mouth) {
            case 'smile':
                return <path d={`M${mouthX - 20},${mouthY} Q${mouthX},${mouthY + 10} ${mouthX + 20},${mouthY}`} stroke="#8B4513" strokeWidth="2" fill="none" strokeLinecap="round" />;
            case 'neutral':
                return <line x1={mouthX - 15} y1={mouthY} x2={mouthX + 15} y2={mouthY} stroke="#8B4513" strokeWidth="2" strokeLinecap="round" />;
            case 'grin':
                return (
                    <>
                        <path d={`M${mouthX - 20},${mouthY} Q${mouthX},${mouthY + 15} ${mouthX + 20},${mouthY}`} stroke="#8B4513" strokeWidth="2" fill="white" />
                        <line x1={mouthX - 15} y1={mouthY + 8} x2={mouthX + 15} y2={mouthY + 8} stroke="#8B4513" strokeWidth="1" />
                    </>
                );
            case 'sad':
                return <path d={`M${mouthX - 20},${mouthY} Q${mouthX},${mouthY - 10} ${mouthX + 20},${mouthY}`} stroke="#8B4513" strokeWidth="2" fill="none" strokeLinecap="round" />;
            case 'smirk':
                return <path d={`M${mouthX - 20},${mouthY} Q${mouthX + 5},${mouthY + 5} ${mouthX + 20},${mouthY - 3}`} stroke="#8B4513" strokeWidth="2" fill="none" strokeLinecap="round" />;
            default:
                return null;
        }
    };

    // Hair
    const renderHair = () => {
        switch (hair) {
            case 'short':
                return (
                    <path
                        d="M60,70 Q60,35 100,30 Q140,35 140,70 L140,50 Q140,40 130,40 Q120,35 110,35 Q100,30 90,35 Q80,35 70,40 Q60,40 60,50 Z"
                        fill={hairColor}
                    />
                );
            case 'long':
                return (
                    <>
                        <path d="M60,70 Q60,35 100,30 Q140,35 140,70 L140,50 Q140,40 130,40 Q120,35 110,35 Q100,30 90,35 Q80,35 70,40 Q60,40 60,50 Z" fill={hairColor} />
                        <path d="M60,70 L55,120 Q55,130 65,130 L75,80" fill={hairColor} />
                        <path d="M140,70 L145,120 Q145,130 135,130 L125,80" fill={hairColor} />
                    </>
                );
            case 'bald':
                return null;
            case 'curly':
                return (
                    <>
                        <circle cx="70" cy="45" r="15" fill={hairColor} />
                        <circle cx="85" cy="35" r="15" fill={hairColor} />
                        <circle cx="100" cy="30" r="15" fill={hairColor} />
                        <circle cx="115" cy="35" r="15" fill={hairColor} />
                        <circle cx="130" cy="45" r="15" fill={hairColor} />
                    </>
                );
            case 'spiky':
                return (
                    <>
                        <path d="M70,60 L65,30 L75,50 L70,25 L80,50 L80,20 L90,50 L95,25 L100,50 L105,20 L110,50 L115,25 L120,50 L125,30 L130,60" fill={hairColor} />
                    </>
                );
            case 'wavy':
                return (
                    <path
                        d="M60,70 Q60,35 100,30 Q140,35 140,70 L140,50 Q135,45 130,50 Q125,45 120,50 Q115,45 110,50 Q105,45 100,50 Q95,45 90,50 Q85,45 80,50 Q75,45 70,50 Q65,45 60,50 Z"
                        fill={hairColor}
                    />
                );
            case 'buzz':
                return (
                    <path
                        d="M65,65 Q65,40 100,35 Q135,40 135,65 L135,55 Q135,45 125,45 Q115,40 105,40 Q100,35 95,40 Q85,40 75,45 Q65,45 65,55 Z"
                        fill={hairColor}
                    />
                );
            case 'ponytail':
                return (
                    <>
                        <path d="M60,70 Q60,35 100,30 Q140,35 140,70 L140,50 Q140,40 130,40 Q120,35 110,35 Q100,30 90,35 Q80,35 70,40 Q60,40 60,50 Z" fill={hairColor} />
                        <ellipse cx="100" cy="40" rx="25" ry="15" fill={hairColor} />
                        <ellipse cx="100" cy="25" rx="15" ry="20" fill={hairColor} />
                    </>
                );
            default:
                return null;
        }
    };

    // Facial Hair
    const renderFacialHair = () => {
        if (!facialHair || facialHair === 'none') return null;

        const color = facialHairColor || hairColor;

        switch (facialHair) {
            case 'beard':
                return (
                    <path
                        d="M70,140 Q70,155 85,160 Q100,165 115,160 Q130,155 130,140 L130,130 Q125,145 115,150 Q100,155 85,150 Q75,145 70,130 Z"
                        fill={color}
                    />
                );
            case 'mustache':
                return (
                    <>
                        <path d="M80,125 Q85,120 95,122 Q100,123 100,125" fill={color} />
                        <path d="M120,125 Q115,120 105,122 Q100,123 100,125" fill={color} />
                    </>
                );
            case 'goatee':
                return (
                    <path
                        d="M90,140 Q90,150 95,155 Q100,158 105,155 Q110,150 110,140 L110,135 Q105,145 100,147 Q95,145 90,135 Z"
                        fill={color}
                    />
                );
            default:
                return null;
        }
    };

    // Accessories
    const renderAccessory = () => {
        if (!accessory || accessory === 'none') return null;

        const color = accessoryColor || '#000000';

        switch (accessory) {
            case 'glasses':
                return (
                    <>
                        <rect x="60" y="80" width="30" height="20" rx="3" fill="none" stroke={color} strokeWidth="2" />
                        <rect x="110" y="80" width="30" height="20" rx="3" fill="none" stroke={color} strokeWidth="2" />
                        <line x1="90" y1="90" x2="110" y2="90" stroke={color} strokeWidth="2" />
                        <path d="M60,90 L50,85" stroke={color} strokeWidth="2" strokeLinecap="round" />
                        <path d="M140,90 L150,85" stroke={color} strokeWidth="2" strokeLinecap="round" />
                    </>
                );
            case 'sunglasses':
                return (
                    <>
                        <rect x="60" y="80" width="30" height="20" rx="3" fill={color} opacity="0.7" stroke={color} strokeWidth="2" />
                        <rect x="110" y="80" width="30" height="20" rx="3" fill={color} opacity="0.7" stroke={color} strokeWidth="2" />
                        <line x1="90" y1="90" x2="110" y2="90" stroke={color} strokeWidth="2" />
                        <path d="M60,90 L50,85" stroke={color} strokeWidth="2" strokeLinecap="round" />
                        <path d="M140,90 L150,85" stroke={color} strokeWidth="2" strokeLinecap="round" />
                    </>
                );
            case 'hat':
                return (
                    <path
                        d="M50,50 Q50,30 100,25 Q150,30 150,50 L145,45 Q145,35 100,30 Q55,35 55,45 Z"
                        fill={color}
                    />
                );
            case 'headphones':
                return (
                    <>
                        <path d="M50,80 Q45,70 45,60 Q45,40 100,35 Q155,40 155,60 Q155,70 150,80" stroke={color} strokeWidth="4" fill="none" strokeLinecap="round" />
                        <rect x="40" y="75" width="15" height="25" rx="5" fill={color} />
                        <rect x="145" y="75" width="15" height="25" rx="5" fill={color} />
                    </>
                );
            case 'earrings':
                return (
                    <>
                        <circle cx="60" cy="105" r="4" fill={color} />
                        <circle cx="140" cy="105" r="4" fill={color} />
                    </>
                );
            default:
                return null;
        }
    };

    // Clothing
    const renderClothing = () => {
        const neckY = 165;

        switch (clothing) {
            case 'tshirt':
                return (
                    <path
                        d="M60,${neckY} L50,${neckY + 20} L50,${neckY + 50} L150,${neckY + 50} L150,${neckY + 20} L140,${neckY} Z"
                        fill={clothingColor}
                    />
                );
            case 'hoodie':
                return (
                    <>
                        <path d={`M60,${neckY} L50,${neckY + 20} L50,${neckY + 50} L150,${neckY + 50} L150,${neckY + 20} L140,${neckY} Z`} fill={clothingColor} />
                        <path d={`M70,${neckY} Q100,${neckY - 10} 130,${neckY}`} stroke={clothingColor} strokeWidth="15" fill="none" opacity="0.7" />
                    </>
                );
            case 'shirt':
                return (
                    <>
                        <path d={`M60,${neckY} L50,${neckY + 20} L50,${neckY + 50} L150,${neckY + 50} L150,${neckY + 20} L140,${neckY} Z`} fill={clothingColor} />
                        <line x1="100" y1={neckY} x2="100" y2={neckY + 40} stroke="white" strokeWidth="2" />
                    </>
                );
            case 'sweater':
                return (
                    <path
                        d={`M60,${neckY} L50,${neckY + 20} L50,${neckY + 50} L150,${neckY + 50} L150,${neckY + 20} L140,${neckY} L130,${neckY + 5} L70,${neckY + 5} Z`}
                        fill={clothingColor}
                    />
                );
            default:
                return null;
        }
    };

    return (
        <svg
            width={size}
            height={size}
            viewBox="0 0 200 220"
            className={className}
            xmlns="http://www.w3.org/2000/svg"
        >
            {/* Clothing (background layer) */}
            <g>{renderClothing()}</g>

            {/* Face */}
            <path d={getFacePath()} fill={skinTone} />

            {/* Hair (back layer for some styles) */}
            {(hair === 'long' || hair === 'ponytail') && <g opacity="0.5">{renderHair()}</g>}

            {/* Facial features */}
            <g>{renderEyebrows()}</g>
            <g>{renderEyes()}</g>
            <g>{renderNose()}</g>
            <g>{renderMouth()}</g>
            <g>{renderFacialHair()}</g>

            {/* Hair (front layer) */}
            {hair !== 'long' && hair !== 'ponytail' && <g>{renderHair()}</g>}

            {/* Accessories (top layer) */}
            <g>{renderAccessory()}</g>
        </svg>
    );
}
