import React, { FC, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';

import { IApp } from '@/shared/api/services/app/model';
import { ComponentSize, SizeOptions } from '@/shared/constants';
import AppIcon from '@/shared/ui/AppIcon/AppIcon';
import LinkButton from '@/shared/ui/LinkButton';
import Tag from '@/shared/ui/Tag/Tag';
import Text from '@/shared/ui/Text';
import { replaceEndOfLine, toSeparatedWithComma } from '@/shared/utils/string';

import Players from '@/assets/icons/humans.svg';
import Rating from '@/assets/icons/rating.svg';
import Star from '@/assets/icons/star.svg';

import styles from './FeaturedCard.module.scss';

const indicators = [Players, Star, Rating];

type FeaturedCardProps = {
  // size: Exclude<ComponentSize, 'large'>;
  size: ComponentSize;
  application: IApp;
};

// TODO: убрать дублирующие поля, когда сделают единые названия на беке (title/name...)
const FeaturedCard: FC<FeaturedCardProps> = ({
  size,
  application: {
    id,
    title = '',
    picture,
    short_description = '',
    short_desc = '',
    tags,
    rating,
    user_count,
    experts_rating,
    play_link,
  },
}) => {
  const { t } = useTranslation();
  const tagsRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  const parameters = [
    user_count,
    rating ? toSeparatedWithComma(Number(rating.toFixed(1))) : '0',
    `${experts_rating ? experts_rating.toFixed(1) : t('ui.no')}%`,
  ];

  return (
    <div onClick={() => navigate(`/apps/details/${id}`)} className={styles.featuredCardRoot}>
      <AppIcon size={size} alt={title} src={picture} />
      <div className={styles.info}>
        <div className={styles.header}>
          <Text variant='17' fontWeight='500' className={styles.title}>
            {title.length ? replaceEndOfLine(title, size === SizeOptions.SMALL ? 14 : 12) : ''}
          </Text>
          <div className={styles.indicators}>
            {indicators.map((indicator, index) => (
              <div key={indicator} className={styles.indicator}>
                <img src={indicator} alt='indicator' className={styles.indicatorIcon} />
                <Text className={styles.indicatorText}>{parameters[index]}</Text>
              </div>
            ))}
          </div>
        </div>
        <Text as='p' className={styles.description}>
          {short_description.length
            ? replaceEndOfLine(short_description, size === SizeOptions.SMALL ? 42 : 37)
            : ''}
          {short_desc.length
            ? replaceEndOfLine(short_desc, size === SizeOptions.SMALL ? 42 : 37)
            : ''}
        </Text>
        <div className={styles.bottom}>
          <div className={styles.tags} ref={tagsRef}>
            {tags &&
              tags.map((tag) => (
                <React.Fragment key={tag}>
                  {<Tag size={SizeOptions.SMALL}>{tag}</Tag>}
                </React.Fragment>
              ))}
          </div>

          {size === SizeOptions.MEDIUM && (
            <LinkButton
              className={styles.button}
              href={play_link}
              onClick={(e) => e.stopPropagation()}
            >
              {t('ui.play')}
            </LinkButton>
          )}
        </div>
      </div>
    </div>
  );
};

export default FeaturedCard;
