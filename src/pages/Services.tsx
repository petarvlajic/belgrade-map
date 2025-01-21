import { FC } from 'react';
import Table from '../components/Services/Table';
import TableHeader from '../components/Services/TableHeader';
import fetchService from '../services/api';
import { MarkerType } from '../types/Marker';
import { useNavigate } from 'react-router-dom';

const Services: FC = () => {
  const navigate = useNavigate();

  const checkJWT = async () => {
    try {
      const { status } = await fetchService.get<MarkerType[]>('login/ping');
      if (status == 401) {
        navigate('/');
      }
    } catch (error) {
      console.log('An unexpected error occurred.');
    }
  };

  checkJWT();
  return (
    <div className="container mx-auto">
      <div>
        <section className="p-3 sm:p-5">
          <div className="mx-auto max-w-screen-xl px-4 lg:px-12">
            <div className="bg-white dark:bg-gray-800 relative shadow-md sm:rounded-lg overflow-hidden">
              <TableHeader />
              <div className="overflow-x-auto">
                <Table />
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default Services;
