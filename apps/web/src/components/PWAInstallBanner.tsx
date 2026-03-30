import { useState } from 'react';
import { usePWAInstall } from '../hooks/usePWAInstall';

export function PWAInstallBanner() {
  const { install, dismiss, showBanner, isIOS } = usePWAInstall();
  const [showIOSGuide, setShowIOSGuide] = useState(false);

  if (!showBanner) return null;

  return (
    <>
      <div
        className="fixed bottom-0 left-0 right-0 z-50 flex items-center justify-between gap-3 px-4 py-3"
        style={{ background: '#0b0f1f', borderTop: '1px solid rgba(255,255,255,0.08)' }}
      >
        <div className="flex items-center gap-3 min-w-0">
          <img src="/favicon.png" alt="AmazeBid" className="w-10 h-10 rounded-xl flex-shrink-0" />
          <div className="min-w-0">
            <p className="text-sm font-semibold text-white truncate">نصب برنامه AmazeBid</p>
            <p className="text-xs truncate" style={{ color: '#8892b0' }}>
              {isIOS ? 'افزودن به صفحه اصلی' : 'دسترسی سریع‌تر، آفلاین هم کار می‌کند'}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 flex-shrink-0">
          {isIOS ? (
            <button
              onClick={() => setShowIOSGuide(true)}
              className="px-4 py-1.5 rounded-lg text-sm font-medium text-white cursor-pointer"
              style={{ background: 'rgba(255,255,255,0.1)' }}
            >
              نحوه نصب
            </button>
          ) : (
            <button
              onClick={install}
              className="px-4 py-1.5 rounded-lg text-sm font-semibold text-white cursor-pointer"
              style={{ background: 'linear-gradient(135deg, #6366f1, #8b5cf6)' }}
            >
              نصب
            </button>
          )}
          <button
            onClick={dismiss}
            className="p-1.5 rounded-lg cursor-pointer"
            style={{ color: '#8892b0' }}
            aria-label="بستن"
          >
            <CloseIcon />
          </button>
        </div>
      </div>

      {showIOSGuide && (
        <div
          className="fixed inset-0 z-50 flex items-end justify-center p-4"
          style={{ background: 'rgba(0,0,0,0.7)' }}
          onClick={() => setShowIOSGuide(false)}
        >
          <div
            className="w-full max-w-sm rounded-2xl p-6"
            style={{ background: '#0b0f1f', border: '1px solid rgba(255,255,255,0.08)' }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-base font-bold text-white">افزودن به صفحه اصلی</h2>
              <button
                onClick={() => setShowIOSGuide(false)}
                className="p-1 rounded-lg cursor-pointer"
                style={{ color: '#8892b0' }}
              >
                <CloseIcon />
              </button>
            </div>

            <div className="space-y-4">
              <Step
                number={1}
                icon={<ShareIcon />}
                text="روی دکمه اشتراک‌گذاری ضربه بزنید"
                hint="نماد مربع با فلش رو به بالا در پایین مرورگر"
              />
              <Step
                number={2}
                icon={<AddIcon />}
                text="«افزودن به صفحه اصلی» را انتخاب کنید"
                hint="به پایین اسکرول کنید تا این گزینه را پیدا کنید"
              />
              <Step
                number={3}
                icon={<CheckIcon />}
                text="روی «افزودن» ضربه بزنید"
                hint="برنامه روی صفحه اصلی شما ظاهر می‌شود"
              />
            </div>

            <button
              onClick={() => { setShowIOSGuide(false); dismiss(); }}
              className="mt-6 w-full py-2.5 rounded-xl text-sm font-medium cursor-pointer"
              style={{ background: 'rgba(255,255,255,0.08)', color: '#c8cde0' }}
            >
              متوجه شدم
            </button>
          </div>
        </div>
      )}
    </>
  );
}

function Step({
  number,
  icon,
  text,
  hint,
}: {
  number: number;
  icon: React.ReactNode;
  text: string;
  hint: string;
}) {
  return (
    <div className="flex items-start gap-3">
      <div
        className="flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold text-white"
        style={{ background: 'rgba(99,102,241,0.3)' }}
      >
        {number}
      </div>
      <div>
        <div className="flex items-center gap-2">
          <span style={{ color: '#c8cde0' }}>{icon}</span>
          <p className="text-sm text-white">{text}</p>
        </div>
        <p className="text-xs mt-0.5" style={{ color: '#8892b0' }}>
          {hint}
        </p>
      </div>
    </div>
  );
}

function CloseIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M18 6L6 18M6 6l12 12" />
    </svg>
  );
}

function ShareIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M4 12v8a2 2 0 002 2h12a2 2 0 002-2v-8M16 6l-4-4-4 4M12 2v13" />
    </svg>
  );
}

function AddIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <rect x="3" y="3" width="18" height="18" rx="2" />
      <path d="M12 8v8M8 12h8" />
    </svg>
  );
}

function CheckIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M20 6L9 17l-5-5" />
    </svg>
  );
}
