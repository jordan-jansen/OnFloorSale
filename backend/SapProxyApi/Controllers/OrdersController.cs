using Microsoft.AspNetCore.Mvc;
using System.Text.Json;
using SapProxyApi.Models;

namespace SapProxyApi.Controllers
{
    [ApiController]
    [Route("api/orders")]
    public class OrdersController : ControllerBase
    {
        private static readonly string OrdersDir = Path.Combine(
            AppDomain.CurrentDomain.BaseDirectory,
            "orders"
        );

        [HttpPost("confirm")]
        public IActionResult ConfirmOrder([FromBody] ConfirmOrderRequest order)
        {
            if (order == null || order.Items == null || order.Items.Count == 0)
            {
                return BadRequest("Invalid order");
            }

            // Ensure folder exists
            Directory.CreateDirectory(OrdersDir);

            var todayFile = Path.Combine(
                OrdersDir,
                $"orders-{DateTime.UtcNow:yyyy-MM-dd}.json"
            );

            List<ConfirmOrderRequest> orders = new();

            // Read existing orders if file exists
            if (System.IO.File.Exists(todayFile))
            {
                var existingJson = System.IO.File.ReadAllText(todayFile);
                orders = JsonSerializer.Deserialize<List<ConfirmOrderRequest>>(existingJson)
                         ?? new List<ConfirmOrderRequest>();
            }

            // Add metadata if not supplied
            order.CreatedAt = DateTime.UtcNow;

            orders.Add(order);

            var json = JsonSerializer.Serialize(
                orders,
                new JsonSerializerOptions
                {
                    WriteIndented = true
                }
            );

            System.IO.File.WriteAllText(todayFile, json);

            return Ok(new
            {
                message = "Order confirmed successfully",
                totalOrdersToday = orders.Count
            });
        }
    }
}
