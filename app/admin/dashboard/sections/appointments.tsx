'use client';

import { useEffect, useState } from 'react';
import {
  FiUser,
  FiMail,
  FiPhone,
  FiMessageSquare,
  FiActivity,
} from 'react-icons/fi';
import axios, { AxiosResponse } from 'axios';
import { motion } from 'framer-motion';

/* -------------------------------------------------------------------------- */
/*                                   Types                                    */
/* -------------------------------------------------------------------------- */

type AppointmentType = string;

interface Appointment {
  _id: string;
  name: string;
  phone: string;
  email: string;
  message?: string;
  type: AppointmentType;
  date: string;
}

type GroupedAppointments = Record<string, Appointment[]>;

interface AppointmentApiResponse {
  data: Appointment[];
}

/* -------------------------------------------------------------------------- */
/*                                  Component                                 */
/* -------------------------------------------------------------------------- */

const Appointments: React.FC = () => {
  const [groupedAppointments, setGroupedAppointments] =
    useState < GroupedAppointments > ({});
  const [mounted, setMounted] = useState < boolean > (false);

  useEffect(() => {
    setMounted(true);

    const fetchAppointments = async (): Promise<void> => {
      try {
        const res: AxiosResponse<AppointmentApiResponse> = await axios.get(
          '/api/routes/appointment'
        );

        const data = res.data?.data ?? [];

        const grouped = data.reduce < GroupedAppointments > ((acc, appt) => {
          const dateOnly = new Date(appt.date)
            .toISOString()
            .split('T')[0];

          if (!acc[dateOnly]) {
            acc[dateOnly] = [];
          }

          acc[dateOnly].push(appt);
          return acc;
        }, {});

        const sortedGrouped: GroupedAppointments = Object.fromEntries(
          Object.entries(grouped).sort(
            ([a], [b]) =>
              new Date(b).getTime() - new Date(a).getTime()
          )
        );

        setGroupedAppointments(sortedGrouped);
      } catch (error) {
        console.error('Error fetching appointments:', error);
      }
    };

    fetchAppointments();
  }, []);

  if (!mounted) return null;

  const dates = Object.keys(groupedAppointments);

  if (dates.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center p-20 bg-white border border-slate-200 rounded-sm">
        <FiActivity className="text-slate-200 text-5xl mb-4" />
        <h3 className="text-slate-900 font-black uppercase tracking-[0.3em] text-xs">
          Zero Records Found
        </h3>
        <p className="text-slate-400 text-[10px] uppercase tracking-widest mt-2">
          The clinical queue is currently empty.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-16">
      {dates.map((date) => (
        <div key={date} className="relative">
          {/* Date Header */}
          <div className="flex items-center space-x-4 mb-8">
            <div className="h-px flex-1 bg-slate-100" />
            <h2 className="text-[10px] font-black text-blue-600 uppercase tracking-[0.5em] bg-white px-4">
              {date}
            </h2>
            <div className="h-px flex-1 bg-slate-100" />
          </div>

          {/* Registry */}
          <div className="bg-white border border-slate-200 rounded-sm overflow-hidden shadow-sm">
            <div className="grid grid-cols-12 bg-slate-50 border-b border-slate-200 py-3 px-6">
              <div className="col-span-4 text-[9px] font-black uppercase tracking-widest text-slate-400">
                Patient Nomenclature
              </div>
              <div className="col-span-3 text-[9px] font-black uppercase tracking-widest text-slate-400">
                Classification
              </div>
              <div className="col-span-5 text-[9px] font-black uppercase tracking-widest text-slate-400">
                Contact / Narrative
              </div>
            </div>

            <div className="divide-y divide-slate-100">
              {groupedAppointments[date].map((appt) => (
                <motion.div
                  key={appt._id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="grid grid-cols-12 px-6 py-6 items-start hover:bg-slate-50/50 transition-colors"
                >
                  {/* Patient */}
                  <div className="col-span-4 pr-4">
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 rounded-sm bg-slate-100 flex items-center justify-center text-slate-400 border border-slate-200">
                        <FiUser size={14} />
                      </div>
                      <div>
                        <p className="text-sm font-bold text-slate-900 leading-none mb-1">
                          {appt.name}
                        </p>
                        <p className="text-[10px] font-mono text-slate-400">
                          ID:{' '}
                          {appt._id.slice(-6).toUpperCase()}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Type */}
                  <div className="col-span-3">
                    <span className="inline-flex items-center px-2 py-0.5 rounded-sm bg-blue-50 text-blue-700 text-[9px] font-black uppercase tracking-widest border border-blue-100">
                      {appt.type}
                    </span>
                  </div>

                  {/* Contact */}
                  <div className="col-span-5 space-y-3">
                    <div className="flex flex-wrap gap-4 text-[11px] font-medium text-slate-600">
                      <div className="flex items-center gap-1.5">
                        <FiPhone className="text-blue-500" />
                        <span>{appt.phone}</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <FiMail className="text-blue-500" />
                        <span className="truncate max-w-[150px]">
                          {appt.email}
                        </span>
                      </div>
                    </div>

                    {appt.message && (
                      <div className="flex items-start gap-2 bg-slate-50 p-3 rounded-sm border-l-2 border-slate-200">
                        <FiMessageSquare
                          className="text-slate-300 mt-1"
                          size={12}
                        />
                        <p className="text-[11px] text-slate-500 italic leading-relaxed">
                          “{appt.message}”
                        </p>
                      </div>
                    )}
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default Appointments;