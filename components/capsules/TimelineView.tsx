'use client';

import { motion } from 'framer-motion';
import { TimeCapsule } from '@/types';
import { format } from 'date-fns';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface TimelineViewProps {
  capsules: TimeCapsule[];
}

const timelineVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: { duration: 0.3 }
  }
};

export function TimelineView({ capsules }: TimelineViewProps) {
  return (
    <div className="space-y-4">
      {capsules.map((capsule) => (
        <motion.div
          key={capsule.id}
          variants={timelineVariants}
          initial="hidden"
          animate="visible"
        >
          <Card>
            <CardHeader>
              <CardTitle>{capsule.title}</CardTitle>
              <Badge variant={capsule.status === 'revealed' ? 'default' : 'secondary'}>
                {capsule.status}
              </Badge>
            </CardHeader>
            <CardContent>
              <p>{capsule.description}</p>
              <p>Scheduled Reveal: {format(new Date(capsule.scheduledReveal), 'PPP')}</p>
              {capsule.selfDestructDate && (
                <p>Self Destruct: {format(new Date(capsule.selfDestructDate), 'PPP')}</p>
              )}
            </CardContent>
          </Card>
        </motion.div>
      ))}
    </div>
  );
}
