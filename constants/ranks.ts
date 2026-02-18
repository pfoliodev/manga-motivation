import { Award, Crown, Gem, Hammer, Medal, Sparkles, TreePine } from 'lucide-react-native';

export interface RankTier {
    name: string;
    color: string;
    glowColor: string;
    minLevel: number;
    icon: React.ComponentType<any>;
    description: string;
}

export const RANK_TIERS: RankTier[] = [
    {
        name: 'BOIS',
        color: '#8B4513',
        glowColor: '#8B4513',
        minLevel: 1,
        icon: TreePine,
        description: 'Le début de ton voyage. Les fondations de ta volonté.'
    },
    {
        name: 'FER',
        color: '#708090',
        glowColor: '#708090',
        minLevel: 5,
        icon: Hammer,
        description: 'La forge de ton esprit. Ta détermination commence à durcir.'
    },
    {
        name: 'BRONZE',
        color: '#CD7F32',
        glowColor: '#CD7F32',
        minLevel: 10,
        icon: Award,
        description: 'Une lueur d\'espoir. Tu commences à te démarquer.'
    },
    {
        name: 'ARGENT',
        color: '#C0C0C0',
        glowColor: '#C0C0C0',
        minLevel: 20,
        icon: Medal,
        description: 'L\'éclat de l\'excellence. Ta discipline est exemplaire.'
    },
    {
        name: 'OR',
        color: '#FFD700',
        glowColor: '#FFD700',
        minLevel: 35,
        icon: Crown,
        description: 'La maîtrise absolue. Ton aura impose le respect.'
    },
    {
        name: 'PLATINE',
        color: '#E5E4E2',
        glowColor: '#00CED1',
        minLevel: 50,
        icon: Gem,
        description: 'Le prestige éternel. Tu as atteint la pureté du diamant.'
    },
    {
        name: 'DIAMANT',
        color: '#B9F2FF',
        glowColor: '#00BFFF',
        minLevel: 75,
        icon: Sparkles,
        description: 'La transcendance totale. Ton aura brille au-delà des limites.'
    },
];

export function getRankForLevel(level: number): RankTier {
    for (let i = RANK_TIERS.length - 1; i >= 0; i--) {
        if (level >= RANK_TIERS[i].minLevel) {
            return RANK_TIERS[i];
        }
    }
    return RANK_TIERS[0];
}
