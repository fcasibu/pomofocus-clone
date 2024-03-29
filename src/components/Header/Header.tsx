import type { ModalType } from '@stores';
import { useConfigStore, useModalStore, useTimerStore } from '@stores';
import { colors, media, spacing } from '@utils';
import { FaChartBar, FaCheckCircle, FaCog, FaUserAlt } from 'react-icons/fa';
import type { IconType } from 'react-icons/lib';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import { shallow } from 'zustand/shallow';

type Links = {
  icon: IconType;
  name: string;
  href?: string;
  modalName?: ModalType;
};

const S = {
  Header: styled.header<{ $count: number }>`
    align-items: center;
    border-bottom: 1px solid ${colors.TRANSPARENT_BLACK};
    display: flex;
    justify-content: space-between;
    margin-bottom: ${spacing.XL};
    padding-bottom: ${spacing.XXS};
    position: relative;

    &:before {
      background: ${colors.WHITE};
      bottom: 0;
      content: '';
      height: 1px;
      position: absolute;
      transition: width 0.5s;
      width: ${({ $count }) => `${$count}%`};

      @media (prefers-reduced-motion) {
        transition: none;
      }
    }
  `,

  Link: styled.li`
    background-color: ${colors.TRANSPARENT_WHITE};
    border-radius: 2px;
    cursor: pointer;
    font-size: 14px;

    &:hover {
      background-color: hsla(0 0% 100% / 0.15);
    }

    > * {
      align-items: center;
      display: flex;
      gap: ${spacing.XXXXS};
    }

    > button {
      background: none;
      border: none;
      color: ${colors.WHITE};
      cursor: pointer;
      padding: ${spacing.XXXS} ${spacing.XXS};
    }

    span {
      display: none;
    }

    a {
      align-items: center;
      color: ${colors.WHITE};
      padding: ${spacing.XXXS} ${spacing.XXS};
    }

    @media ${media.greaterThan('md')} {
      span {
        display: unset;
      }
    }
  `,

  Links: styled.ul`
    display: flex;
    gap: 10px;
  `,

  Logo: styled(Link)`
    align-items: center;
    color: ${colors.WHITE};
    display: flex;
    gap: ${spacing.XXXXS};

    > span {
      display: none;
      font-size: 18px;
      font-weight: 600;
    }

    @media ${media.greaterThan('sm')} {
      > span {
        display: unset;
      }
    }
  `,
};

export function Header() {
  const { seconds, currentTimerName } = useTimerStore(
    (state) => ({
      seconds: state.seconds,
      currentTimerName: state.currentTimerName,
    }),
    shallow,
  );
  const time = useConfigStore((state) => state.config.timer.time);
  const percentageValue = (seconds / time[currentTimerName]) * 100;

  return (
    <S.Header $count={percentageValue}>
      <S.Logo to="/" aria-label="Go to Home Page">
        <FaCheckCircle size={18} focusable={false} />
        <span>Pomofocus</span>
      </S.Logo>
      <NavigationBar />
    </S.Header>
  );
}

const links: Links[] = [
  {
    icon: FaChartBar,
    name: 'Report',
    href: '/report',
  },
  {
    icon: FaCog,
    name: 'Setting',
    modalName: 'settings',
  },
  {
    icon: FaUserAlt,
    name: 'Login',
    href: '/login',
  },
];

function NavigationBar() {
  const open = useModalStore((state) => state.open);

  const handleOpenModal = (modalName?: ModalType) => () => {
    if (!modalName) return;
    open(modalName);
  };

  return (
    <nav>
      <S.Links>
        {links.map(({ name, href, icon: Icon, modalName }, index) => (
          <S.Link key={`${name}-${index}`}>
            {href ? (
              /* Refactor aria-label after authentication is implemented */
              <Link to={href} aria-label={`Go to ${name}`}>
                <Icon size={14} />
                <span>{name}</span>
              </Link>
            ) : (
              <button
                type="button"
                aria-label={`Open ${name}`}
                onClick={handleOpenModal(modalName)}
              >
                <Icon size={14} />
                <span>{name}</span>
              </button>
            )}
          </S.Link>
        ))}
      </S.Links>
    </nav>
  );
}

export default Header;
