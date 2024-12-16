import { TypographyP } from "@/components/ui/typography";
import { Separator } from "@/components/ui/separator";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "@/store";
import { setCurrentView } from "@/store/slices/views/categoriesViewSlice";
import AllProducts from '@/components/views/home/categories/AllProducts';
import AllCategories from '@/components/views/home/categories/AllCategories';

export default function Categories() {
  const dispatch = useDispatch();
  const currentView = useSelector((state: RootState) => state.categoriesView.currentView);


  const renderView = () => {
    switch (currentView) {
      case 'AllProducts':
        return <AllProducts onBack={() => dispatch(setCurrentView('AllCategories'))} />;
      default:
        return <AllCategories />
    }
  };

  return (
    <div className="flex flex-col min-h-0 flex-1 mt-4">
      <div className="flex items-center justify-between relative flex-shrink-0">
        <TypographyP className="absolute pr-4 bg-background font-medium">
          Categories
        </TypographyP>
        <Separator className="dark:bg-zinc-800/60 bg-zinc-50/70" />
      </div>
      {renderView()}
    </div>
  );
}
