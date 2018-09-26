/* =============================================================================
 *         AUTHOR: JulioJu
 *         GITHUB: https://github.com/JulioJu
 *        LICENSE: MIT (https://opensource.org/licenses/MIT)
 *        CREATED: Wed 26 Sep 2018 01:11:08 PM CEST
 *       MODIFIED:
 *
 *          USAGE:
 *
 *    DESCRIPTION:
 * ============================================================================
 */

// See:
// https://developer.mozilla.org/en-US/docs/Web/API/HTMLHyperlinkElementUtils/search
// And https://developer.mozilla.org/en-US/docs/Web/API/URL
const parsedUrl: URL = new URL(document.location.href);
alert(parsedUrl.searchParams.get('gamemode'));

// vim: ts=2 sw=2 et:
