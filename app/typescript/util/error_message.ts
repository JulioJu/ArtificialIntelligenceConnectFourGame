/* =============================================================================
  *         AUTHOR: JulioJu
  *         GITHUB: https://github.com/JulioJu
  *        LICENSE: MIT (https://opensource.org/licenses/MIT)
  *        CREATED: Tue 23 Oct 2018 04:20:53 PM CEST
  *       MODIFIED: Tue 23 Oct 2018 04:21:22 PM CEST
  *
  *          USAGE:
  *
  *    DESCRIPTION:
  * ============================================================================
  */

export const ErrorFatal: (messageError: string) => void
        = (messageError: string): void => {
  console.error('ERROR FATAL:', messageError);
  alert ('ERROR FATAL: ' +  messageError);
};
