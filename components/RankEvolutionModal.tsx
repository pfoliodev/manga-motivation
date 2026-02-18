import { RANK_TIERS } from '@/constants/ranks';
import { X, Zap } from 'lucide-react-native';
import React from 'react';
import { Dimensions, Modal, Pressable, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Animated, { FadeInDown, SlideInUp } from 'react-native-reanimated';

interface RankEvolutionModalProps {
    visible: boolean;
    onClose: () => void;
    currentLevel: number;
}

const { width: WINDOW_WIDTH, height: WINDOW_HEIGHT } = Dimensions.get('window');

export const RankEvolutionModal = ({ visible, onClose, currentLevel }: RankEvolutionModalProps) => {
    return (
        <Modal
            animationType="fade"
            transparent={true}
            visible={visible}
            onRequestClose={onClose}
        >
            <View style={styles.overlay}>
                <Pressable style={styles.dismissArea} onPress={onClose} />

                <Animated.View
                    entering={SlideInUp.duration(400).springify()}
                    style={styles.modalContainer}
                >
                    {/* Header */}
                    <View style={styles.header}>
                        <View>
                            <Text style={styles.title}>VOIE DE L'ÉVOLUTION</Text>
                            <Text style={styles.subtitle}>Ta progression dans AURA</Text>
                        </View>
                        <TouchableOpacity
                            onPress={onClose}
                            style={styles.closeButton}
                            hitSlop={{ top: 20, bottom: 20, left: 20, right: 20 }}
                            activeOpacity={0.7}
                        >
                            <View pointerEvents="none">
                                <X color="#FFF" size={24} />
                            </View>
                        </TouchableOpacity>
                    </View>

                    <ScrollView
                        showsVerticalScrollIndicator={false}
                        contentContainerStyle={styles.scrollContent}
                    >
                        {RANK_TIERS.map((tier, index) => {
                            const isUnlocked = currentLevel >= tier.minLevel;
                            const isCurrent = index === RANK_TIERS.length - 1
                                ? currentLevel >= tier.minLevel
                                : currentLevel >= tier.minLevel && currentLevel < RANK_TIERS[index + 1].minLevel;

                            return (
                                <Animated.View
                                    key={tier.name}
                                    entering={FadeInDown.delay(index * 100).duration(400)}
                                    style={[
                                        styles.rankItem,
                                        isCurrent && { borderColor: tier.color, borderWidth: 2, shadowColor: tier.glowColor, shadowOpacity: 0.5, shadowRadius: 10, elevation: 5 },
                                        !isUnlocked && styles.lockedRank
                                    ]}
                                >
                                    <View style={[styles.iconContainer, { backgroundColor: isUnlocked ? tier.color + '20' : '#333' }]}>
                                        {React.createElement(tier.icon, {
                                            size: 24,
                                            color: isUnlocked ? tier.color : '#666',
                                            strokeWidth: 2.5
                                        })}
                                    </View>

                                    <View style={styles.rankInfo}>
                                        <View style={styles.rankHeaderLine}>
                                            <Text style={[styles.rankName, { color: isUnlocked ? '#FFF' : '#666' }]}>
                                                {tier.name}
                                            </Text>
                                            {isCurrent && (
                                                <View style={[styles.currentBadge, { backgroundColor: tier.color }]}>
                                                    <Text style={styles.currentBadgeText}>ACTUEL</Text>
                                                </View>
                                            )}
                                        </View>
                                        <Text style={[styles.rankDescription, { color: isUnlocked ? '#AAA' : '#444' }]} numberOfLines={2}>
                                            {tier.description}
                                        </Text>
                                        <View style={styles.levelRequirement}>
                                            <Zap size={12} color={isUnlocked ? tier.color : '#444'} />
                                            <Text style={[styles.levelText, { color: isUnlocked ? tier.color : '#444' }]}>
                                                REQUIS: NIVEAU {tier.minLevel}
                                            </Text>
                                        </View>
                                    </View>

                                    {!isUnlocked && (
                                        <View style={styles.lockOverlay}>
                                            <Text style={styles.lockText}>BLOQUÉ</Text>
                                        </View>
                                    )}
                                </Animated.View>
                            );
                        })}
                    </ScrollView>

                    <View style={styles.footer}>
                        <Text style={styles.footerQuote}>
                            "Le travail acharné bat le talent quand le talent ne travaille pas dur."
                        </Text>
                    </View>
                </Animated.View>
            </View>
        </Modal>
    );
};

const styles = StyleSheet.create({
    overlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.85)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    dismissArea: {
        ...StyleSheet.absoluteFillObject,
    },
    modalContainer: {
        width: WINDOW_WIDTH * 0.9,
        maxHeight: WINDOW_HEIGHT * 0.8,
        backgroundColor: '#151515',
        borderRadius: 24,
        overflow: 'hidden',
        borderWidth: 1,
        borderColor: '#333',
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 24,
        borderBottomWidth: 1,
        borderBottomColor: '#333',
        backgroundColor: '#1A1A1A',
    },
    title: {
        fontFamily: 'Bangers_400Regular',
        fontSize: 28,
        color: '#FFD700',
        letterSpacing: 2,
    },
    subtitle: {
        fontSize: 12,
        color: '#888',
        textTransform: 'uppercase',
        letterSpacing: 1,
        marginTop: 2,
    },
    closeButton: {
        padding: 10,
        backgroundColor: '#333',
        borderRadius: 12,
    },
    scrollContent: {
        padding: 16,
        gap: 12,
    },
    rankItem: {
        flexDirection: 'row',
        backgroundColor: '#1E1E1E',
        borderRadius: 16,
        padding: 16,
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#2A2A2A',
        position: 'relative',
        overflow: 'hidden',
    },
    lockedRank: {
        opacity: 0.6,
    },
    iconContainer: {
        width: 56,
        height: 56,
        borderRadius: 16,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 16,
    },
    rankInfo: {
        flex: 1,
    },
    rankHeaderLine: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
        marginBottom: 4,
    },
    rankName: {
        fontSize: 18,
        fontWeight: '900',
        letterSpacing: 1,
    },
    currentBadge: {
        paddingHorizontal: 8,
        paddingVertical: 2,
        borderRadius: 4,
    },
    currentBadgeText: {
        color: '#000',
        fontSize: 10,
        fontWeight: '900',
    },
    rankDescription: {
        fontSize: 12,
        lineHeight: 16,
        marginBottom: 8,
    },
    levelRequirement: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
    },
    levelText: {
        fontSize: 10,
        fontWeight: '800',
        letterSpacing: 0.5,
    },
    lockOverlay: {
        position: 'absolute',
        right: -20,
        top: 10,
        backgroundColor: '#333',
        paddingHorizontal: 30,
        paddingVertical: 4,
        transform: [{ rotate: '45deg' }],
    },
    lockText: {
        color: '#888',
        fontSize: 8,
        fontWeight: '900',
    },
    footer: {
        padding: 20,
        backgroundColor: '#1A1A1A',
        borderTopWidth: 1,
        borderTopColor: '#333',
        alignItems: 'center',
    },
    footerQuote: {
        color: '#666',
        fontSize: 11,
        fontStyle: 'italic',
        textAlign: 'center',
    },
});
