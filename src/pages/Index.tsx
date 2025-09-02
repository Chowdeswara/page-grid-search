import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Package, TrendingUp, Users, ShoppingCart, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

const Index = () => {
  const stats = [
    { icon: Package, label: "Total Orders", value: "1,247", change: "+12%" },
    { icon: TrendingUp, label: "Revenue", value: "€324,891", change: "+8%" },
    { icon: Users, label: "Customers", value: "89", change: "+15%" },
    { icon: ShoppingCart, label: "Pending Orders", value: "23", change: "-3%" }
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <div className="bg-gradient-to-br from-primary/5 via-background to-primary/10 border-b border-border">
        <div className="max-w-7xl mx-auto px-6 py-16">
          <div className="text-center space-y-6">
            <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-full text-sm font-medium">
              <Package className="h-4 w-4" />
              Logistics Management System
            </div>
            <h1 className="text-4xl lg:text-6xl font-bold text-foreground">
              Smart Logistics
              <span className="text-primary block">Dashboard</span>
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Streamline your logistics operations with advanced search capabilities, 
              smart data grids, and real-time order management.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-6">
              <Link to="/orders">
                <Button size="lg" className="bg-primary hover:bg-primary-hover text-primary-foreground">
                  <Package className="mr-2 h-5 w-5" />
                  View Orders
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
              <Button variant="outline" size="lg">
                Learn More
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Section */}
      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat, index) => (
            <Card key={index} className="p-6 bg-card border-border hover:shadow-lg transition-shadow">
              <div className="flex items-center justify-between">
                <div className="space-y-2">
                  <p className="text-sm font-medium text-muted-foreground">{stat.label}</p>
                  <p className="text-2xl font-bold text-foreground">{stat.value}</p>
                  <p className={`text-sm font-medium ${
                    stat.change.startsWith('+') ? 'text-success' : 'text-destructive'
                  }`}>
                    {stat.change} from last month
                  </p>
                </div>
                <div className="p-3 bg-primary/10 rounded-lg">
                  <stat.icon className="h-6 w-6 text-primary" />
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>

      {/* Features Section */}
      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="text-center space-y-4 mb-12">
          <h2 className="text-3xl font-bold text-foreground">Powerful Features</h2>
          <p className="text-lg text-muted-foreground">
            Everything you need to manage your logistics operations efficiently
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <Card className="p-8 bg-card border-border">
            <div className="space-y-4">
              <div className="p-3 bg-primary/10 rounded-lg w-fit">
                <Package className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-xl font-semibold text-foreground">Smart Grid</h3>
              <p className="text-muted-foreground">
                Advanced data grid with infinite scroll, real-time updates, and powerful filtering. 
                Load 50 records at a time with seamless pagination.
              </p>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>• Infinite scroll with lazy loading</li>
                <li>• Real-time data updates</li>
                <li>• Sortable columns</li>
                <li>• Export capabilities</li>
              </ul>
            </div>
          </Card>

          <Card className="p-8 bg-card border-border">
            <div className="space-y-4">
              <div className="p-3 bg-primary/10 rounded-lg w-fit">
                <TrendingUp className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-xl font-semibold text-foreground">Advanced Search</h3>
              <p className="text-muted-foreground">
                Comprehensive search functionality with multiple filter options. 
                Configurable dropdowns and smart text search capabilities.
              </p>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>• Multiple filter categories</li>
                <li>• Configurable dropdown options</li>
                <li>• Real-time search results</li>
                <li>• Save and load filter presets</li>
              </ul>
            </div>
          </Card>
        </div>

        <div className="text-center pt-12">
          <Link to="/orders">
            <Button size="lg" className="bg-primary hover:bg-primary-hover text-primary-foreground">
              <Package className="mr-2 h-5 w-5" />
              Start Managing Orders
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Index;