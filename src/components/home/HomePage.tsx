import type { Locale } from '../../i18n/types';
import { getTranslations, getLocalePath } from '../../i18n';

interface HomePageProps {
  locale?: Locale;
  images: {
    header: { src: string; alt: string };
    catalog: { src: string };
    goal: { src: string };
    gacha: { src: string };
  };
}

export default function HomePage({ locale = 'ja', images }: HomePageProps) {
  const t = getTranslations(locale);

  const tools = [
    {
      href: getLocalePath('/weapons', locale),
      image: images.catalog,
      title: t.home.catalogTitle,
      description: t.home.catalogDescription,
      color: 'amber',
      bgClass: 'bg-amber-100/50',
      hoverText: 'group-hover:text-amber-600',
      barColor: 'bg-amber-500',
    },
    {
      href: getLocalePath('/weapons/goal', locale),
      image: images.goal,
      title: t.home.goalTitle,
      description: t.home.goalDescription,
      color: 'blue',
      bgClass: 'bg-blue-100/50',
      hoverText: 'group-hover:text-blue-600',
      barColor: 'bg-blue-500',
    },
    {
      href: getLocalePath('/weapons/gacha', locale),
      image: images.gacha,
      title: t.home.gachaTitle,
      description: t.home.gachaDescription,
      color: 'purple',
      bgClass: 'bg-purple-100/50',
      hoverText: 'group-hover:text-purple-600',
      barColor: 'bg-purple-500',
    },
  ];

  return (
    <div className="space-y-10">
      {/* ヒーローセクション */}
      <div className="relative rounded-2xl overflow-hidden shadow-xl group">
        <div className="absolute inset-0 bg-gradient-to-t from-gray-900/80 to-transparent z-10 transition-opacity duration-500 group-hover:opacity-90" />
        <img
          src={images.header.src}
          alt={images.header.alt}
          className="w-full h-48 sm:h-64 object-cover transform transition-transform duration-700 group-hover:scale-105"
        />
        <div className="absolute bottom-0 left-0 p-6 sm:p-8 z-20 text-white">
          <p className="text-gray-200 text-sm sm:text-base opacity-90">
            {t.home.heroText}
          </p>
        </div>
      </div>

      {/* ツール一覧 */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {tools.map((tool) => (
          <a
            key={tool.href}
            href={tool.href}
            className="group relative bg-white rounded-2xl shadow-sm border border-gray-100 p-6 transition-all duration-300 hover:shadow-xl hover:-translate-y-1 overflow-hidden"
          >
            <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
              <img
                src={tool.image.src}
                alt={tool.title}
                className="w-24 h-24 object-contain grayscale"
              />
            </div>
            <div className="relative z-10">
              <div
                className={`w-12 h-12 ${tool.bgClass} rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300 overflow-hidden`}
              >
                <img
                  src={tool.image.src}
                  alt={tool.title}
                  className="w-full h-full object-contain"
                />
              </div>
              <h3
                className={`text-xl font-bold text-gray-800 mb-2 ${tool.hoverText} transition-colors`}
              >
                {tool.title}
              </h3>
              <p className="text-gray-500 text-sm leading-relaxed">
                {tool.description}
              </p>
            </div>
            <div
              className={`absolute bottom-0 left-0 h-1 w-0 ${tool.barColor} group-hover:w-full transition-all duration-300`}
            />
          </a>
        ))}
      </div>

      {/* インフォメーション */}
      <div className="bg-gray-50 rounded-2xl p-6 border border-gray-100 text-center">
        <p className="text-gray-500 text-sm">
          {t.home.disclaimer.split('\n').map((line, i) => (
            <span key={i}>
              {i > 0 && <br />}
              {line}
            </span>
          ))}
        </p>
      </div>
    </div>
  );
}
