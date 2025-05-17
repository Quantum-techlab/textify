
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const Index = () => {
  const navigate = useNavigate();
  
  useEffect(() => {
    // Redirect to landing page
    navigate('/', { replace: true });
  }, [navigate]);
  
  // This component doesn't render anything
  return null;
};

export default Index;
