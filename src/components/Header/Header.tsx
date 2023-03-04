import styled from 'styled-components';
import { Link } from 'react-router-dom';
import type { IconType } from 'react-icons/lib';
import { FaUserAlt, FaCog, FaCheckCircle, FaChartBar } from 'react-icons/fa';
import { colors, media, spacing } from '@utils';

type Links = {
  icon?: IconType;
  name: string;
  href?: string;
};

const S = {
  Header: styled.header`
    align-items: center;
    border-bottom: 1px solid rgba(0, 0, 0, 0.1);
    display: flex;
    justify-content: space-between;
    padding: 14px ${spacing.XXXS};
  `,

  Link: styled.li`
    background-color: rgba(255, 255, 255, 0.2);
    border-radius: 2px;
    cursor: pointer;
    font-size: 14px;
    padding: ${spacing.XXXS} ${spacing.XXS};

    &:hover {
      background-color: rgba(255, 255, 255, 0.23);
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
      font-size: 18px;
      font-weight: 600;
    }
  `,
};

export function Header() {
  return (
    <S.Header>
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
