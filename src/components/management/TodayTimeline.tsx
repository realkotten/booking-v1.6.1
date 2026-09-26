import React from 'react';
import { Appointment } from '../../types';
import { 
  Clock, 
  User, 
  Scissors, 
  Sparkles, 
  CheckCircle2, 
  Play,
  ChevronLeft,
  VolumeX,
  Armchair
} from 'lucide-react';
import { toPersianDigits, addMinutesToTime } from '../../utils/dateUtils';
import { formatPrice } from '../../utils/formatUtils';
import { getAppointmentStatusBadge, getBookingSourceLabel } from '../../utils/statusUtils';
import { PriceDisplay } from '../common/PriceDisplay';

interface TodayTimelineProps {
  appointments: Appointment[];
  onSelectAppointment: (appointment: Appointment) => void;
  onStartAppointment: (aptId: string) => void;
  onCompleteAppointment: (aptId: string) => void;
}

export const TodayTimeline: React.FC<TodayTimelineProps> = ({
  appointments,
  onSelectAppointment,
  onStartAppointment,
  onCompleteAppointment,
}) => {
  if (appointments.length === 0) {
    return (
      <div className="clay-card rounded-[28px] p-8 text-center border border-white/60 bg-white/40 backdrop-blur-md">
        <Clock className="w-8 h-8 text-stone-400 mx-auto mb-2 opacity-70" />
        <p className="text-sm font-bold text-stone-800">نوبتی برای امروز ثبت نشده است</p>
        <p className="text-xs text-stone-500 mt-1">از طریق دکمه «پذیرش فوری» می‌توانید مراجعین حضوری جدید را ثبت نمایید.</p>
      </div>
    );
  }

  return (
    <div className="space-y-3 w-full" dir="rtl">
      {appointments.map((apt, index) => {
        const isBlocked = apt.status === 'blocked';
        const isCancelled = apt.status === 'cancelled';
        const isInProgress = apt.status === 'in_progress';
        const isCompleted = apt.status === 'completed';
        const duration = apt.durationMinutes || 45;
        const endTimeStr = apt.endTime || addMinutesToTime(apt.startTime, duration);
        const statusMeta = getAppointmentStatusBadge(apt.status);
        const sourceMeta = getBookingSourceLabel(apt.bookingSource);

        return (
          <div
            key={apt.id || index}
            onClick={() => onSelectAppointment(apt)}
            className={`group rounded-[24px] sm:rounded-[28px] p-3.5 sm:p-4.5 border transition-all cursor-pointer flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-xs hover:shadow-md ${
              isInProgress
                ? 'bg-stone-900 text-white border-stone-800 shadow-lg ring-2 ring-[#7e5352]/30'
                : isCompleted
                ? 'clay-card-subtle bg-white/45 backdrop-blur-md border-white/60 text-stone-700 opacity-90'
                : isBlocked
                ? 'bg-stone-100/70 backdrop-blur-md border-stone-300/80 border-dashed text-stone-600'
                : isCancelled
                ? 'bg-stone-100/50 border-stone-200 text-stone-400 opacity-60'
                : 'clay-card bg-white/70 backdrop-blur-md border-white/90 hover:bg-white/90 text-stone-900'
            }`}
          >
            {/* Left/Main Information */}
            <div className="flex items-center gap-3 min-w-0 flex-1">
              {/* Time Block Badge */}
              <div
                className={`px-3 py-2 rounded-2xl text-center shrink-0 flex flex-col items-center justify-center min-w-[70px] ${
                  isInProgress
                    ? 'bg-stone-800/90 text-[#fbdcd9] border border-stone-700'
                    : isCompleted
                    ? 'bg-stone-100 text-stone-600'
                    : 'bg-white/90 text-stone-900 border border-stone-200/60 shadow-2xs'
                }`}
              >
                <div className="flex items-center gap-1 font-mono text-xs font-black">
                  <Clock className="w-3 h-3 text-[#7e5352]" />
                  <span>{toPersianDigits(apt.startTime)}</span>
                </div>
                <span className="text-[10px] opacity-75 font-mono mt-0.5">
                  تا {toPersianDigits(endTimeStr)}
                </span>
                <span className="text-[9px] opacity-60 mt-0.5 font-medium">
                  {toPersianDigits(duration)} دقیقه
                </span>
              </div>

              {/* Customer & Service Info */}
              <div className="text-right min-w-0 flex-1 space-y-1">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className={`text-sm font-black truncate ${isInProgress ? 'text-white' : 'text-stone-900'}`}>
                    {apt.customerName}
                  </span>

                  {apt.isQuietSession && (
                    <span className="inline-flex items-center gap-1 text-[9px] bg-[#fbdcd9] text-[#7e5352] px-2 py-0.5 rounded-full font-bold">
                      <VolumeX className="w-2.5 h-2.5" />
                      <span>سکوت</span>
                    </span>
                  )}

                  {sourceMeta?.label && (
                    <span className={`text-[9px] px-2 py-0.5 rounded-full font-medium ${
                      isInProgress ? 'bg-stone-800 text-stone-300' : 'bg-stone-100 text-stone-600'
                    }`}>
                      {sourceMeta.label}
                    </span>
                  )}
                </div>

                {/* Service Details & Pricing */}
                <div className="flex items-center gap-2.5 flex-wrap text-xs">
                  <span className={`flex items-center gap-1 font-medium ${isInProgress ? 'text-stone-300' : 'text-stone-700'}`}>
                    <Scissors className="w-3.5 h-3.5 text-[#7e5352] shrink-0" />
                    <span className="truncate">{apt.service?.name || 'سرویس اصلاح و پیرایش'}</span>
                  </span>

                  {/* Price display with discount support */}
                  <div className="mr-auto sm:mr-0">
                    <PriceDisplay
                      service={apt.service}
                      price={apt.servicePrice}
                      realPrice={apt.originalServicePrice}
                      size="xs"
                      showBadge={true}
                    />
                  </div>
                </div>

                {/* Barber and Chair Note */}
                <div className={`text-[10px] flex items-center gap-2 ${isInProgress ? 'text-stone-400' : 'text-stone-500'}`}>
                  <span>{apt.barberName || 'آرایشگر شیفت'}</span>
                  {apt.chairName && (
                    <>
                      <span>·</span>
                      <span className="flex items-center gap-0.5">
                        <Armchair className="w-3 h-3 opacity-70" />
                        <span>{apt.chairName}</span>
                      </span>
                    </>
                  )}
                </div>
              </div>
            </div>

            {/* Right/Action Buttons & Status Badge */}
            <div
              className="flex items-center justify-between sm:justify-end gap-2.5 shrink-0 pt-2 sm:pt-0 border-t sm:border-t-0 border-stone-200/40"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Status Badge */}
              <span
                className={`text-[10px] px-2.5 py-1 rounded-full font-bold shadow-2xs ${
                  isInProgress
                    ? 'bg-amber-400/20 text-amber-300 border border-amber-400/40'
                    : isCompleted
                    ? 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                    : isBlocked
                    ? 'bg-stone-200 text-stone-700'
                    : isCancelled
                    ? 'bg-rose-100 text-rose-800 border border-rose-200'
                    : 'bg-white text-stone-800 border border-stone-200/80'
                }`}
              >
                {statusMeta.label}
              </span>

              {/* Interactive Actions */}
              {isInProgress ? (
                <button
                  type="button"
                  onClick={() => onCompleteAppointment(apt.id)}
                  className="text-xs font-black bg-gradient-to-r from-[#fbdcd9] to-[#d88d85] text-stone-950 px-4 py-2 rounded-2xl shadow-sm hover:shadow transition-transform active:scale-95 flex items-center gap-1.5 cursor-pointer"
                >
                  <CheckCircle2 className="w-3.5 h-3.5 text-stone-900" />
                  <span>تکمیل نوبت</span>
                </button>
              ) : apt.status === 'confirmed' || apt.status === 'reserved' ? (
                <button
                  type="button"
                  onClick={() => onStartAppointment(apt.id)}
                  className="text-xs font-black bg-stone-900 hover:bg-stone-800 text-white px-3.5 py-2 rounded-2xl shadow-sm hover:shadow transition-transform active:scale-95 flex items-center gap-1.5 cursor-pointer"
                >
                  <Play className="w-3 h-3 fill-current text-[#fbdcd9]" />
                  <span>شروع سرویس</span>
                </button>
              ) : null}

              {/* Detail Open Chevron */}
              <div
                onClick={() => onSelectAppointment(apt)}
                className="w-7 h-7 rounded-xl flex items-center justify-center bg-stone-100/70 hover:bg-stone-200/80 text-stone-500 transition-colors cursor-pointer"
                title="مشاهده جزئیات کامل نوبت"
              >
                <ChevronLeft className="w-4 h-4 text-stone-600" />
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};
