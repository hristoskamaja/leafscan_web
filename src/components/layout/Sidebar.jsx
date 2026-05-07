import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import {
    LayoutDashboard,
    Leaf,
    Users,
    FlaskConical,
    BarChart2,
    Settings,
    UserCircle,
    LogOut
} from 'lucide-react';
import './Sidebar.css';

const NAV = [
    { to: '/dashboard',  label: 'Dashboard',       Icon: LayoutDashboard },
    { to: '/diseases',   label: 'Diseases',         Icon: Leaf            },
    { to: '/users',      label: 'Users',            Icon: Users           },
    { to: '/analyses',   label: 'Analysis History', Icon: FlaskConical    },
    { to: '/statistics', label: 'Statistics',       Icon: BarChart2       },
];

const BOTTOM_NAV = [
    { to: '/settings', label: 'Settings', Icon: Settings    },
    { to: '/profile',  label: 'Profile',  Icon: UserCircle  },
];

export default function Sidebar() {
    const { logout, user } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => { logout(); navigate('/login'); };

    return (
        <aside className="sidebar">
            {/* Logo */}
            <div className="sidebar-logo">
                <div className="sidebar-logo-icon">
                    <Leaf size={20} color="#fff" />
                </div>
                <span className="sidebar-logo-text">LeafScanAI</span>
            </div>

            {/* Main nav */}
            <nav className="sidebar-nav">
                {NAV.map(({ to, label, Icon }) => (
                    <NavLink
                        key={to}
                        to={to}
                        className={({ isActive }) =>
                            `sidebar-link${isActive ? ' sidebar-link--active' : ''}`
                        }
                    >
                        <Icon size={18} className="sidebar-link-icon" strokeWidth={1.8} />
                        <span>{label}</span>
                    </NavLink>
                ))}
            </nav>

            {/* Bottom nav */}
            <div className="sidebar-bottom">
                {BOTTOM_NAV.map(({ to, label, Icon }) => (
                    <NavLink
                        key={to}
                        to={to}
                        className={({ isActive }) =>
                            `sidebar-link${isActive ? ' sidebar-link--active' : ''}`
                        }
                    >
                        <Icon size={18} className="sidebar-link-icon" strokeWidth={1.8} />
                        <span>{label}</span>
                    </NavLink>
                ))}
                <button className="sidebar-logout" onClick={handleLogout}>
                    <LogOut size={18} strokeWidth={1.8} />
                    <span>Log out</span>
                </button>
            </div>
        </aside>
    );
}
