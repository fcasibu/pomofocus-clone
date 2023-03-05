import { useTimer } from '@hooks';
import { colors, media, spacing } from '@utils';
import { FaChartBar, FaCheckCircle, FaCog, FaUserAlt } from 'react-icons/fa';
import type { IconType } from 'react-icons/lib';
import { Link } from 'react-router-dom';
import styled from 'styled-components';

type Links = {
  icon?: IconType;
  name: string;
  href?: string;
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
      width: ${({ $count }) => `${$count}%`};
    }
  `,

  Link: styled.li`
    background-color: ${colors.TRANSPARENT_WHITE};
    border-radius: 2px;
    cursor: pointer;
    font-size: 14px;
    padding: ${spacing.XXXS} ${spacing.XXS};

    &:hover {
      background-color: hsla(0 0% 100% / 0.15);
    }

    > * {
      align-items: center;
      display: flex;
      gap: ${spacing.XXXXS};
    }

    span {
      display: none;
    }

    a {
      align-items: center;
      color: ${colors.WHITE};
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
  const { percentageValue } = useTimer();

  return (
    <S.Header $count={percentageValue}>
      <S.Logo to="/">
        <FaCheckCircle size={18} />
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
  },
  {
    icon: FaCog,
    name: 'Setting',
  },
  {
    icon: FaUserAlt,
    name: 'Login',
    href: '/login',
  },
];

function NavigationBar() {
  return (
    <nav>
      <S.Links>
        {links.map(({ name, href, icon: Icon }, index) => (
          <S.Link key={`${name}-${index}`}>
            {href ? (
              <Link to={href}>
                {Icon ? <Icon size={14} /> : null}
                <span>{name}</span>
              </Link>
            ) : (
              <div>
                {Icon ? <Icon size={14} /> : null}
                <span>{name}</span>
              </div>
            )}
          </S.Link>
        ))}
      </S.Links>
    </nav>
  );
}

export default Header;
