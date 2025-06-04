import clsx from 'clsx';
import { formatDistance } from 'date-fns';
import { enUS, ru } from 'date-fns/locale';
import { FC, MouseEvent, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { useSwipeable } from 'react-swipeable';

import i18n from '@/app/providers/i18config';
import { IFavoriteApp } from '@/shared/api/services/app/model';
import { ComponentSize, SizeOptions } from '@/shared/constants';
import AppIcon from '@/shared/ui/AppIcon/AppIcon';
import LinkButton from '@/shared/ui/LinkButton';
import Text from '@/shared/ui/Text';

import Details from '@/assets/icons/fav-open-details.svg';
import Remove from '@/assets/icons/fav-remove.svg';

import styles from './FavoriteCard.module.scss';

type FavoriteCardProps = {
  size: ComponentSize;
  application: IFavoriteApp;
  handleDelete: (
    setOpen: React.Dispatch<React.SetStateAction<boolean>>,
    id: number,
    e: MouseEvent<HTMLAnchorElement>,
  ) => void;
};

const config = {
  delta: 10,
  preventScrollOnSwipe: true,
  trackTouch: true,
  trackMouse: true,
};

const FavoriteCard: FC<FavoriteCardProps> = ({
  size,
  application: { title, picture, last_visit, play_link, id },
  handleDelete,
}) => {
  const lastVisitedDistance = last_visit
    ? formatDistance(new Date(last_visit), new Date(), {
        addSuffix: true,
        locale: i18n.language === 'ru' ? ru : enUS,
      })
    : null;

  const { t } = useTranslation();
  const navigate = useNavigate();

  const [open, setOpen] = useState(false);

  const handlers = useSwipeable({
    onSwipedLeft: (eventData) => {
      if (eventData.initial[0] > 180) setOpen(true);
    },
    onSwipedRight: () => {
      setOpen(false);
    },
    ...config,
  });

  return (
    <div
      className={clsx(styles.favoriteCardRoot)}
      {...handlers}
      onClick={() => navigate(`/apps/details/${id}`)}
    >
      <AppIcon size={size} alt={title} src={picture} />

      <div className={styles.info}>
        <div className={styles.header}>
          <Text variant='17' fontWeight='500' className={styles.title}>
            {title}
          </Text>
        </div>

        {lastVisitedDistance && (
          <Text as='p' className={styles.description}>
            {t('favorites.last-visited')}:{' '}
            <span className={styles.count}>{lastVisitedDistance}</span>
          </Text>
        )}
      </div>

      <div className={clsx(styles.removeCard, open && styles.open)}>
        <div className={styles.play}>
          <LinkButton
            size={SizeOptions.SMALL}
            className={styles.button}
            href={play_link}
            onClick={(e) => e.stopPropagation()}
          >
            {t('ui.play')}
          </LinkButton>
        </div>
        <div className={styles.details}>
          <LinkButton
            className={styles.favControlBtn}
            href={`/apps/details/${id}`}
            onClick={(e) => e.stopPropagation()}
          >
            <img src={Details} alt='remove' />
            <span>{t('favorites.open-details')}</span>
          </LinkButton>
        </div>
        <div className={styles.remove}>
          <LinkButton
            onClick={(e) => handleDelete(setOpen, id, e)}
            className={styles.favControlBtn}
          >
            <img src={Remove} alt='remove' />
            <span>{t('favorites.remove-from-favorites')}</span>
          </LinkButton>
        </div>
      </div>
    </div>
  );
};

export default FavoriteCard;
