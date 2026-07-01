import type { Dispatch, SetStateAction } from 'react';
import { useState } from 'react';
import { logout } from '../../services/logout';
import { useAppDispatch, useAppSelector } from '../../hooks/redux-hooks';
import { setUserData } from '../../redux/userSlice';
import { Coins, LogOut } from 'lucide-react';
import ConfirmDialog from '../ConfirmDialog';

const AccountDetails = ({ isCollapsed, setShowPlans }: { isCollapsed: boolean; setShowPlans: Dispatch<SetStateAction<boolean>> }) => {
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const [loggingOut, setLoggingOut] = useState(false);

  const userData = useAppSelector((state) => state.user.userData);

  const dispatch = useAppDispatch();

  const handleCreditsClick = () => {
    setShowPlans(true);
  };

  const handleLogout = async () => {
    setLoggingOut(true);
    await logout();
    dispatch(setUserData({ userData: null }));
    setLoggingOut(false);
    setShowLogoutConfirm(false);
  };

  const handleCloseLogoutDialog = () => {
    if (!loggingOut) {
      setShowLogoutConfirm(false);
    }
  };

  return (

    <div className='flex items-center gap-3 px-3 py-5 min-w-67.5'>
      {isCollapsed ? (
        userData?.avatarUrl ? (
          <img src={userData.avatarUrl} alt='Profile pic' className='w-8 h-8 rounded-full object-cover shrink-0' />
        ) : (
          <div className='w-8 h-8 rounded-full bg-linear-to-br from-primary to-primary-dark flex items-center justify-center text-xs font-medium text-white shrink-0'>
            {userData?.name?.charAt(0)?.toUpperCase() || 'U'}
          </div>
        )
      ) : (
        <>
          {userData?.avatarUrl ? (
            <img src={userData.avatarUrl} alt='Profile pic' className='w-8 h-8 rounded-full object-cover shrink-0' />
          ) : (
            <div className='w-8 h-8 rounded-full bg-linear-to-br from-primary to-primary-dark flex items-center justify-center text-xs font-medium text-white shrink-0'>
              {userData?.name?.charAt(0)?.toUpperCase() || 'U'}
            </div>
          )}
          <div className='flex-1 min-w-0'>
            <p className='text-sm font-medium text-white truncate'>{userData?.name || 'User'}</p>
          </div>
          <div className='flex items-center gap-1'>
            <button onClick={handleCreditsClick} className='p-1.5 rounded-md text-text-secondary hover:text-accent-hover transition-colors cursor-pointer' title='Credits'>
              <Coins size={18} />
            </button>
            <button onClick={() => setShowLogoutConfirm(true)} className='p-1.5 rounded-md text-text-secondary hover:text-red-400 transition-colors cursor-pointer' title='Logout'>
              <LogOut size={18} />
            </button>
          </div>
        </>
      )}
      <ConfirmDialog
        open={showLogoutConfirm}
        title='Log out'
        message='Are you sure you want to log out?'
        confirmLabel='Log out'
        loading={loggingOut}
        onConfirm={handleLogout}
        onClose={handleCloseLogoutDialog}
      />
    </div>
  );
};

export default AccountDetails;