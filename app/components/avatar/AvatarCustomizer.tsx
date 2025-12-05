"use client";

import { useState } from 'react';
import type { CustomAvatar } from '../../lib/customAvatarTypes';
import {
    DEFAULT_CUSTOM_AVATAR,
    SKIN_TONES,
    HAIR_COLORS,
    CLOTHING_COLORS,
} from '../../lib/customAvatarTypes';
import CustomAvatarDisplay from './CustomAvatarDisplay';
import { X, Shuffle } from 'lucide-react';

interface AvatarCustomizerProps {
    initialAvatar?: CustomAvatar;
    onSave: (avatar: CustomAvatar) => void;
    onClose: () => void;
}

export default function AvatarCustomizer({
    initialAvatar = DEFAULT_CUSTOM_AVATAR,
    onSave,
    onClose,
}: AvatarCustomizerProps) {
    const [avatar, setAvatar] = useState<CustomAvatar>(initialAvatar);
    const [activeTab, setActiveTab] = useState<'face' | 'hair' | 'accessories' | 'clothing'>('face');

    const updateAvatar = (updates: Partial<CustomAvatar>) => {
        setAvatar((prev) => ({ ...prev, ...updates }));
    };

    const randomize = () => {
        const randomAvatar: CustomAvatar = {
            faceShape: ['circle', 'square', 'rounded', 'oval'][Math.floor(Math.random() * 4)] as any,
            skinTone: SKIN_TONES[Math.floor(Math.random() * SKIN_TONES.length)],
            eyes: ['normal', 'happy', 'wink', 'closed', 'surprised'][Math.floor(Math.random() * 5)] as any,
            eyeColor: ['#4A3728', '#2E86AB', '#6A994E', '#8B4513'][Math.floor(Math.random() * 4)],
            eyebrows: ['normal', 'raised', 'angry', 'sad', 'thin'][Math.floor(Math.random() * 5)] as any,
            nose: ['small', 'medium', 'large', 'button'][Math.floor(Math.random() * 4)] as any,
            mouth: ['smile', 'neutral', 'grin', 'sad', 'smirk'][Math.floor(Math.random() * 5)] as any,
            hair: ['short', 'long', 'bald', 'curly', 'spiky', 'wavy', 'buzz', 'ponytail'][Math.floor(Math.random() * 8)] as any,
            hairColor: HAIR_COLORS[Math.floor(Math.random() * HAIR_COLORS.length)],
            facialHair: ['none', 'beard', 'mustache', 'goatee'][Math.floor(Math.random() * 4)] as any,
            facialHairColor: HAIR_COLORS[Math.floor(Math.random() * HAIR_COLORS.length)],
            accessory: ['none', 'glasses', 'sunglasses', 'hat', 'headphones', 'earrings'][Math.floor(Math.random() * 6)] as any,
            accessoryColor: '#000000',
            clothing: ['tshirt', 'hoodie', 'shirt', 'sweater'][Math.floor(Math.random() * 4)] as any,
            clothingColor: CLOTHING_COLORS[Math.floor(Math.random() * CLOTHING_COLORS.length)],
        };
        setAvatar(randomAvatar);
    };

    const handleSave = () => {
        onSave(avatar);
        onClose();
    };

    const ColorPicker = ({ colors, value, onChange }: { colors: string[]; value: string; onChange: (color: string) => void }) => (
        <div className="flex flex-wrap gap-2">
            {colors.map((color) => (
                <button
                    key={color}
                    onClick={() => onChange(color)}
                    className={`h-10 w-10 rounded-full border-2 transition-all hover:scale-110 ${value === color ? 'border-indigo-500 ring-2 ring-indigo-500/50' : 'border-white/20'
                        }`}
                    style={{ backgroundColor: color }}
                    aria-label={`Select color ${color}`}
                />
            ))}
        </div>
    );

    const OptionButton = ({ label, isSelected, onClick }: { label: string; isSelected: boolean; onClick: () => void }) => (
        <button
            onClick={onClick}
            className={`rounded-xl px-4 py-2 text-sm font-semibold transition-all ${isSelected
                    ? 'bg-indigo-500 text-white shadow-lg shadow-indigo-500/25'
                    : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
                }`}
        >
            {label}
        </button>
    );

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm">
            <div className="relative w-full max-w-5xl max-h-[90vh] overflow-hidden rounded-3xl bg-gradient-to-br from-slate-900 to-slate-800 shadow-2xl">
                {/* Header */}
                <div className="flex items-center justify-between border-b border-white/10 p-6">
                    <h2 className="text-2xl font-bold text-white">アバターカスタマイズ</h2>
                    <div className="flex gap-2">
                        <button
                            onClick={randomize}
                            className="flex items-center gap-2 rounded-xl bg-purple-600 px-4 py-2 font-semibold text-white transition-all hover:bg-purple-500"
                        >
                            <Shuffle className="h-4 w-4" />
                            ランダム
                        </button>
                        <button
                            onClick={onClose}
                            className="rounded-xl bg-slate-700 p-2 text-white transition-all hover:bg-slate-600"
                        >
                            <X className="h-6 w-6" />
                        </button>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 p-6 overflow-y-auto max-h-[calc(90vh-180px)]">
                    {/* Preview */}
                    <div className="flex flex-col items-center gap-4">
                        <div className="rounded-2xl bg-gradient-to-br from-indigo-500/20 to-purple-500/20 p-8 ring-1 ring-white/10">
                            <CustomAvatarDisplay avatar={avatar} size={300} />
                        </div>
                    </div>

                    {/* Controls */}
                    <div className="space-y-6">
                        {/* Tabs */}
                        <div className="flex gap-2 border-b border-white/10">
                            {(['face', 'hair', 'accessories', 'clothing'] as const).map((tab) => (
                                <button
                                    key={tab}
                                    onClick={() => setActiveTab(tab)}
                                    className={`px-4 py-2 font-semibold transition-all ${activeTab === tab
                                            ? 'border-b-2 border-indigo-500 text-white'
                                            : 'text-slate-400 hover:text-slate-300'
                                        }`}
                                >
                                    {tab === 'face' && '👤 顔'}
                                    {tab === 'hair' && '💇 髪'}
                                    {tab === 'accessories' && '👓 アクセサリー'}
                                    {tab === 'clothing' && '👕 服装'}
                                </button>
                            ))}
                        </div>

                        {/* Face Tab */}
                        {activeTab === 'face' && (
                            <div className="space-y-6">
                                <div>
                                    <label className="mb-2 block text-sm font-semibold text-white">顔の形</label>
                                    <div className="flex flex-wrap gap-2">
                                        {(['circle', 'square', 'rounded', 'oval'] as const).map((shape) => (
                                            <OptionButton
                                                key={shape}
                                                label={shape === 'circle' ? '丸' : shape === 'square' ? '四角' : shape === 'rounded' ? '角丸' : '楕円'}
                                                isSelected={avatar.faceShape === shape}
                                                onClick={() => updateAvatar({ faceShape: shape })}
                                            />
                                        ))}
                                    </div>
                                </div>

                                <div>
                                    <label className="mb-2 block text-sm font-semibold text-white">肌の色</label>
                                    <ColorPicker
                                        colors={SKIN_TONES}
                                        value={avatar.skinTone}
                                        onChange={(color) => updateAvatar({ skinTone: color })}
                                    />
                                </div>

                                <div>
                                    <label className="mb-2 block text-sm font-semibold text-white">目</label>
                                    <div className="flex flex-wrap gap-2">
                                        {(['normal', 'happy', 'wink', 'closed', 'surprised'] as const).map((eye) => (
                                            <OptionButton
                                                key={eye}
                                                label={eye === 'normal' ? '通常' : eye === 'happy' ? '笑顔' : eye === 'wink' ? 'ウィンク' : eye === 'closed' ? '閉じ' : '驚き'}
                                                isSelected={avatar.eyes === eye}
                                                onClick={() => updateAvatar({ eyes: eye })}
                                            />
                                        ))}
                                    </div>
                                </div>

                                <div>
                                    <label className="mb-2 block text-sm font-semibold text-white">眉毛</label>
                                    <div className="flex flex-wrap gap-2">
                                        {(['normal', 'raised', 'angry', 'sad', 'thin'] as const).map((brow) => (
                                            <OptionButton
                                                key={brow}
                                                label={brow === 'normal' ? '通常' : brow === 'raised' ? '上げ' : brow === 'angry' ? '怒り' : brow === 'sad' ? '悲しみ' : '細い'}
                                                isSelected={avatar.eyebrows === brow}
                                                onClick={() => updateAvatar({ eyebrows: brow })}
                                            />
                                        ))}
                                    </div>
                                </div>

                                <div>
                                    <label className="mb-2 block text-sm font-semibold text-white">鼻</label>
                                    <div className="flex flex-wrap gap-2">
                                        {(['small', 'medium', 'large', 'button'] as const).map((nose) => (
                                            <OptionButton
                                                key={nose}
                                                label={nose === 'small' ? '小' : nose === 'medium' ? '中' : nose === 'large' ? '大' : 'ボタン'}
                                                isSelected={avatar.nose === nose}
                                                onClick={() => updateAvatar({ nose: nose })}
                                            />
                                        ))}
                                    </div>
                                </div>

                                <div>
                                    <label className="mb-2 block text-sm font-semibold text-white">口</label>
                                    <div className="flex flex-wrap gap-2">
                                        {(['smile', 'neutral', 'grin', 'sad', 'smirk'] as const).map((mouth) => (
                                            <OptionButton
                                                key={mouth}
                                                label={mouth === 'smile' ? '笑顔' : mouth === 'neutral' ? '普通' : mouth === 'grin' ? 'にやり' : mouth === 'sad' ? '悲しみ' : 'ニヤリ'}
                                                isSelected={avatar.mouth === mouth}
                                                onClick={() => updateAvatar({ mouth: mouth })}
                                            />
                                        ))}
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Hair Tab */}
                        {activeTab === 'hair' && (
                            <div className="space-y-6">
                                <div>
                                    <label className="mb-2 block text-sm font-semibold text-white">髪型</label>
                                    <div className="flex flex-wrap gap-2">
                                        {(['short', 'long', 'bald', 'curly', 'spiky', 'wavy', 'buzz', 'ponytail'] as const).map((hair) => (
                                            <OptionButton
                                                key={hair}
                                                label={
                                                    hair === 'short' ? '短髪' :
                                                        hair === 'long' ? '長髪' :
                                                            hair === 'bald' ? '坊主' :
                                                                hair === 'curly' ? 'カーリー' :
                                                                    hair === 'spiky' ? 'スパイキー' :
                                                                        hair === 'wavy' ? 'ウェーブ' :
                                                                            hair === 'buzz' ? 'バズカット' :
                                                                                'ポニーテール'
                                                }
                                                isSelected={avatar.hair === hair}
                                                onClick={() => updateAvatar({ hair: hair })}
                                            />
                                        ))}
                                    </div>
                                </div>

                                <div>
                                    <label className="mb-2 block text-sm font-semibold text-white">髪の色</label>
                                    <ColorPicker
                                        colors={HAIR_COLORS}
                                        value={avatar.hairColor}
                                        onChange={(color) => updateAvatar({ hairColor: color })}
                                    />
                                </div>

                                <div>
                                    <label className="mb-2 block text-sm font-semibold text-white">ヒゲ</label>
                                    <div className="flex flex-wrap gap-2">
                                        {(['none', 'beard', 'mustache', 'goatee'] as const).map((facial) => (
                                            <OptionButton
                                                key={facial}
                                                label={facial === 'none' ? 'なし' : facial === 'beard' ? 'あごひげ' : facial === 'mustache' ? '口ひげ' : 'ヤギひげ'}
                                                isSelected={avatar.facialHair === facial}
                                                onClick={() => updateAvatar({ facialHair: facial })}
                                            />
                                        ))}
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Accessories Tab */}
                        {activeTab === 'accessories' && (
                            <div className="space-y-6">
                                <div>
                                    <label className="mb-2 block text-sm font-semibold text-white">アクセサリー</label>
                                    <div className="flex flex-wrap gap-2">
                                        {(['none', 'glasses', 'sunglasses', 'hat', 'headphones', 'earrings'] as const).map((acc) => (
                                            <OptionButton
                                                key={acc}
                                                label={
                                                    acc === 'none' ? 'なし' :
                                                        acc === 'glasses' ? 'メガネ' :
                                                            acc === 'sunglasses' ? 'サングラス' :
                                                                acc === 'hat' ? '帽子' :
                                                                    acc === 'headphones' ? 'ヘッドホン' :
                                                                        'イヤリング'
                                                }
                                                isSelected={avatar.accessory === acc}
                                                onClick={() => updateAvatar({ accessory: acc })}
                                            />
                                        ))}
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Clothing Tab */}
                        {activeTab === 'clothing' && (
                            <div className="space-y-6">
                                <div>
                                    <label className="mb-2 block text-sm font-semibold text-white">服装</label>
                                    <div className="flex flex-wrap gap-2">
                                        {(['tshirt', 'hoodie', 'shirt', 'sweater'] as const).map((cloth) => (
                                            <OptionButton
                                                key={cloth}
                                                label={cloth === 'tshirt' ? 'Tシャツ' : cloth === 'hoodie' ? 'パーカー' : cloth === 'shirt' ? 'シャツ' : 'セーター'}
                                                isSelected={avatar.clothing === cloth}
                                                onClick={() => updateAvatar({ clothing: cloth })}
                                            />
                                        ))}
                                    </div>
                                </div>

                                <div>
                                    <label className="mb-2 block text-sm font-semibold text-white">服の色</label>
                                    <ColorPicker
                                        colors={CLOTHING_COLORS}
                                        value={avatar.clothingColor}
                                        onChange={(color) => updateAvatar({ clothingColor: color })}
                                    />
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                {/* Footer */}
                <div className="flex items-center justify-end gap-3 border-t border-white/10 p-6">
                    <button
                        onClick={onClose}
                        className="rounded-xl bg-slate-700 px-6 py-3 font-semibold text-white transition-all hover:bg-slate-600"
                    >
                        キャンセル
                    </button>
                    <button
                        onClick={handleSave}
                        className="rounded-xl bg-gradient-to-r from-indigo-500 to-purple-500 px-6 py-3 font-semibold text-white shadow-lg shadow-indigo-500/25 transition-all hover:scale-105"
                    >
                        保存
                    </button>
                </div>
            </div>
        </div>
    );
}
