    window.renderRevenueChart = function(orders) {
      try {
        if (!window.Recharts) {
          console.warn('Recharts not loaded yet');
          return;
        }
        const { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } = window.Recharts;
        
        const days = 14;
        const today = new Date();
        const chartData = [];
        
        for (let i = days - 1; i >= 0; i--) {
          const d = new Date(today);
          d.setDate(d.getDate() - i);
          const dateStr = d.toISOString().split('T')[0];
          
          let dailyRevenue = 0;
          orders.forEach(o => {
            if (o.createdAt) {
              const orderDate = new Date(o.createdAt).toISOString().split('T')[0];
              if (orderDate === dateStr) {
                const pkgPrice = o.package === 'Premium' ? 949 : (o.package === 'Exclusive' ? 649 : 349);
                const actualTotal = o.totalPrice !== undefined ? Number(o.totalPrice) : pkgPrice;
                
                if (o.advancePaymentStatus === 'কনফার্মড' || o.advancePaymentStatus === 'ভেরিফাইড' || o.advancePaymentStatus === 'Confirmed') {
                  dailyRevenue += Number(o.advancePayment) || 0;
                } else if (o.advancePaymentStatus === 'সম্পূর্ণ পরিশোধিত') {
                  dailyRevenue += actualTotal;
                }
              }
            }
          });
          
          const displayDate = d.toLocaleDateString('bn-BD', { month: 'short', day: 'numeric' });
          chartData.push({
            date: dateStr,
            displayDate: displayDate,
            Revenue: dailyRevenue
          });
        }

        const CustomTooltip = ({ active, payload, label }) => {
          if (active && payload && payload.length) {
            return (
              <div style={{ backgroundColor: '#1e293b', padding: '12px', border: '1px solid #334155', borderRadius: '8px', color: '#f8fafc', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.3)' }}>
                <p style={{ margin: '0 0 6px 0', fontSize: '13px', color: '#94a3b8' }}>{payload[0].payload.displayDate}</p>
                <p style={{ margin: 0, fontWeight: '700', color: '#3b82f6', fontSize: '16px' }}>৳ {payload[0].value}</p>
              </div>
            );
          }
          return null;
        };

        const ChartComponent = () => (
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#334155" vertical={false} />
              <XAxis dataKey="displayDate" stroke="#94a3b8" tick={{ fill: '#94a3b8', fontSize: 12 }} tickMargin={10} axisLine={false} tickLine={false} />
              <YAxis stroke="#94a3b8" tick={{ fill: '#94a3b8', fontSize: 12 }} axisLine={false} tickLine={false} tickFormatter={(value) => '৳' + value} />
              <Tooltip content={<CustomTooltip />} cursor={{ stroke: '#334155', strokeWidth: 1, strokeDasharray: '5 5' }} />
              <Area type="monotone" dataKey="Revenue" stroke="#3b82f6" strokeWidth={3} fillOpacity={1} fill="url(#colorRevenue)" />
            </AreaChart>
          </ResponsiveContainer>
        );

        const rootElement = document.getElementById('recharts-container');
        if (rootElement) {
          if (!rootElement.dataset.rendered) {
            const root = ReactDOM.createRoot(rootElement);
            rootElement.dataset.rendered = "true";
            rootElement._reactRoot = root;
          }
          rootElement._reactRoot.render(<ChartComponent />);
        }
      } catch (e) {
        console.error('Error rendering chart:', e);
      }
    }
    if (typeof allOrders !== 'undefined' && allOrders.length > 0) {
      window.renderRevenueChart(allOrders);
    }
