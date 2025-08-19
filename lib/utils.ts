// lib/utils.ts - General Utility Functions

/**
 * Shaqo lagu qaabeeyo lacagta.
 * @param amount - Qiimaha lacagta.
 * @param currency - Nooca lacagta (default: ETB).
 * @returns Lacagta oo qaabaysan.
 */
export const formatCurrency = (amount: number, currency: string = 'ETB'): string => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currency,
    minimumFractionDigits: 2,
  }).format(amount);
};

/**
 * Shaqo lagu qaabeeyo taariikhda.
 * @param dateString - Taariikhda qaab string ah.
 * @param format - Qaabka taariikhda (e.g., 'DD/MM/YYYY').
 * @returns Taariikhda oo qaabaysan.
 */
export const formatDate = (dateString: string, format: string = 'YYYY-MM-DD'): string => {
  const date = new Date(dateString);
  const year = date.getFullYear();
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  const day = date.getDate().toString().padStart(2, '0');

  switch (format) {
    case 'DD/MM/YYYY':
      return `${day}/${month}/${year}`;
    case 'MM/DD/YYYY':
      return `${month}/${day}/${year}`;
    case 'YYYY-MM-DD':
    default:
      return `${year}-${month}-${day}`;
  }
};

/**
 * Shaqo lagu xaqiijiyo qaabka email-ka.
 * @param email - Email-ka la xaqiijinayo.
 * @returns run/been.
 */
export const isValidEmail = (email: string): boolean => {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
};

/**
 * Shaqo lagu xisaabiyo boqolleyda.
 * @param part - Qaybta.
 * @param total - Wadarta.
 * @returns Boqolleyda.
 */
export const calculatePercentage = (part: number, total: number): number => {
  if (total === 0) return 0;
  return (part / total) * 100;
};

/**
 * Shaqo lagu xisaabiyo qiimaha hoos u dhaca (depreciation) ee hantida.
 * @param initialValue - Qiimaha hore.
 * @param depreciationRate - Boqolleyda hoos u dhaca sannadkii (tusaale, 0.10 for 10%).
 * @param yearsInUse - Tirada sanooyinka la isticmaalay.
 * @returns Qiimaha buuga ee hadda.
 */
export const calculateBookValue = (initialValue: number, depreciationRate: number, yearsInUse: number): number => {
  const depreciatedValue = initialValue * (1 - depreciationRate * yearsInUse);
  return Math.max(0, depreciatedValue); // Qiimaha buuga ma noqon karo mid ka yar eber
};

/**
 * Shaqo lagu soo koobo qoraal dheer.
 * @param text - Qoraalka.
 * @param maxLength - Tirada ugu badan ee xarfaha.
 * @returns Qoraalka oo soo kooban.
 */
export const truncateText = (text: string, maxLength: number): string => {
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength) + '...';
};

// Add more utility functions as needed (e.g., data validation, string manipulation, array helpers)
